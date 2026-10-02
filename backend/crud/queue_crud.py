from models import Queue, Visit, Doctor, Patient, Symptoms_master
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from sqlalchemy.exc import IntegrityError

# ---------------------------------------------------------------------------
# Real-world OPD queue rules (single source of truth for status flow)
# ---------------------------------------------------------------------------
# Canonical statuses (stored with this exact casing):
STATUS_WAITING = "Waiting"
STATUS_CALLED = "Called"
STATUS_SERVING = "Serving"
STATUS_COMPLETED = "Completed"
STATUS_SKIPPED = "Skipped"
STATUS_CANCELLED = "Cancelled"

ACTIVE_STATUSES = [STATUS_WAITING, STATUS_CALLED, STATUS_SERVING]

# Allowed transitions: current -> set(next). Anything else is rejected so the
# Visit and Queue rows can never diverge into an impossible real-world state.
ALLOWED_TRANSITIONS = {
    STATUS_WAITING: {STATUS_CALLED, STATUS_SERVING, STATUS_SKIPPED, STATUS_CANCELLED, STATUS_COMPLETED},
    STATUS_CALLED: {STATUS_SERVING, STATUS_SKIPPED, STATUS_WAITING, STATUS_CANCELLED, STATUS_COMPLETED},
    STATUS_SERVING: {STATUS_COMPLETED, STATUS_CANCELLED},
    STATUS_SKIPPED: {STATUS_WAITING, STATUS_CALLED, STATUS_CANCELLED},
    STATUS_CANCELLED: set(),
    STATUS_COMPLETED: set(),
}

TOKEN_START = 101
FIRST_PATIENT_BUFFER_MIN = 2
STALE_CALLED_MINUTES = 15
MAX_SKIP_BEFORE_NOSHOW_BOOST = 2


def _norm(status: str) -> str:
    return (status or "").strip().lower()


def _can_transition(current: str, nxt: str) -> bool:
    return nxt in ALLOWED_TRANSITIONS.get((current or "").strip().title(), set())


def _set_status(q: Queue, visit: Visit, new_status: str):
    """Set Queue + Visit status together so they can never diverge."""
    q.status = new_status
    q.update_at = datetime.now()
    if visit is not None:
        visit.status = new_status
        visit.update_at = datetime.now()


def matches_specialization(doc_spec: str, target_spec: str) -> bool:
    if not target_spec or not doc_spec:
        return False
    s1 = str(doc_spec).strip().lower()
    s2 = str(target_spec).strip().lower()
    if s1 == s2 or s1 in s2 or s2 in s1:
        return True
    root1 = s1[:5]
    root2 = s2[:5]

    if len(root1) >= 4 and root1 == root2:
        return True
    return False


def calculate_waiting_bonus(create_at) -> int:
    """
    Aging algorithm:
    Calculates bonus based on actual elapsed waiting time since arrival.
    +5 bonus points for every 10 minutes waited.
    Idempotent: dependent on create_at vs now, so multiple calls/refreshes do not repeatedly accumulate bonus.
    """
    if not create_at:
        return 0
    now = datetime.now()
    if isinstance(create_at, str):
        try:
            create_at = datetime.fromisoformat(create_at)
        except Exception:
            return 0
    try:
        elapsed_seconds = max(0, (now - create_at).total_seconds())
        elapsed_minutes = int(elapsed_seconds / 60)
        # 5 bonus points per 10 minutes of waiting
        return (elapsed_minutes // 10) * 5
    except Exception:
        return 0


def next_token_for_doctor(did: int, visit_day: date, db: Session) -> int:
    """Next OPD token is per-doctor per-day (real OPD rule), not global.

    Uses MAX(token) for that doctor+day so parallel counters, cancelled
    tokens and multi-doctor setups never collide or reuse numbers.
    """
    row = db.query(func.max(Visit.token)).filter(
        Visit.did == did,
        Visit.visit_date == visit_day,
    ).first()
    current_max = row[0] if row and row[0] is not None else (TOKEN_START - 1)
    return int(current_max) + 1


def find_active_visit(pid: int, did: int, visit_day: date, db: Session):
    """Return today's still-active visit for this patient+doctor, if any.

    Prevents the classic real-world bug: receptionist registers the same
    patient twice and the patient holds two tokens for one doctor.
    """
    return db.query(Visit).filter(
        Visit.pid == pid,
        Visit.did == did,
        Visit.visit_date == visit_day,
        func.lower(Visit.status).in_([s.lower() for s in ACTIVE_STATUSES]),
    ).first()


def add_queue(que, db: Session):
    # Rule: Never create duplicate Queue for one Visit.
    existing = db.query(Queue).filter(Queue.vid == que.vid).first()
    if existing:
        return existing

    newQueue = Queue(
        vid=que.vid,
        queue_position=que.queue_position,
        priority_score=que.priority_score,
        waiting_bonus=que.waiting_bonus or 0,
        manual_boost=getattr(que, "manual_boost", 0) or 0,
        skip_count=getattr(que, "skip_count", 0) or 0,
        final_score=que.final_score or que.priority_score,
        estimated_wait_time=que.estimated_wait_time or 0,
        status=(que.status or STATUS_WAITING).strip().title()
    )

    db.add(newQueue)
    db.commit()
    db.refresh(newQueue)

    return newQueue



def get_queues(db: Session, today_only: bool = False):
    q = db.query(Queue)
    today = date.today()
    doctor_ids = db.query(Visit.did).join(
        Queue, Queue.vid == Visit.vid
    ).filter(
        Visit.visit_date == today
    ).distinct().all()

    # Keep persisted queue positions and wait estimates in sync with the
    # current consultation workload before returning queue rows.
    for (did,) in doctor_ids:
        recalculate_doctor_queue(did, db)
    if today_only:
        q = q.join(Visit, Queue.vid == Visit.vid).filter(Visit.visit_date == today)
    return q.all()



def get_one_queue(qid, db: Session):
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    if exits_queue is None:
        return {"message": "No queue item found with this Id"}
    return exits_queue



def update_queue(qid: int, que, db: Session):
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    if exits_queue is None:
        return {"message": "No queue item found with this Id"}

    exits_queue.vid = que.vid
    exits_queue.queue_position = que.queue_position
    exits_queue.priority_score = que.priority_score
    exits_queue.waiting_bonus = que.waiting_bonus
    if hasattr(que, "manual_boost"):
        exits_queue.manual_boost = que.manual_boost or 0
    exits_queue.final_score = que.final_score
    exits_queue.estimated_wait_time = que.estimated_wait_time
    exits_queue.status = (que.status or exits_queue.status).strip().title()

    db.commit()
    db.refresh(exits_queue)
    return exits_queue



def delete_queue(qid: int, db: Session):
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    if exits_queue is None:
        return {"message": "No queue item found with this Id"}

    db.delete(exits_queue)
    db.commit()
    return exits_queue


def _current_serving_workload(did: int, today: date, avg_time: int, db: Session) -> int:
    serving_entry = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == did,
        Visit.visit_date == today,
        func.lower(Queue.status) == "serving"
    ).first()

    called_entry = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == did,
        Visit.visit_date == today,
        func.lower(Queue.status) == "called"
    ).first()

    if serving_entry:
        started_at = serving_entry.update_at or serving_entry.create_at
        elapsed_minutes = 0
        if started_at:
            if isinstance(started_at, str):
                try:
                    started_at = datetime.fromisoformat(started_at)
                except Exception:
                    started_at = None
            if started_at:
                elapsed_minutes = max(0, int((datetime.now() - started_at).total_seconds() / 60))
        return max(0, avg_time - elapsed_minutes)
    elif called_entry:
        return avg_time
    return 0


def recalculate_doctor_queue(did: int, db: Session):
    """
    Recalculates Aging, Final Score, Queue Position, and Estimated Wait Time
    for all waiting patients of a doctor.

    final_score = base_priority + aging_bonus + manual_boost
    manual_boost survives recalculation (fixes recall/emergency-upgrade bug
    where the old code overwrote the recall bonus on the next refresh).
    """
    today = date.today()
    doc = db.query(Doctor).filter(Doctor.did == did).first()
    avg_time = (doc.avg_time or 10) if doc else 10

    current_serving_workload = _current_serving_workload(did, today, avg_time, db)

    # Fetch waiting entries today
    waiting_rows = db.query(Queue, Visit, Symptoms_master).join(
        Visit, Queue.vid == Visit.vid
    ).outerjoin(
        Symptoms_master, Visit.sid == Symptoms_master.sid
    ).filter(
        Visit.did == did,
        Visit.visit_date == today,
        func.lower(Queue.status) == "waiting"
    ).all()

    items = []
    for q, v, s in waiting_rows:
        base_priority = s.priority_score if s and s.priority_score is not None else (q.priority_score or 10)
        aging = calculate_waiting_bonus(q.create_at or v.create_at)
        manual = int(getattr(q, "manual_boost", 0) or 0)
        bonus = aging + manual
        final_sc = base_priority + bonus
        items.append({
            "queue": q,
            "visit": v,
            "symptom": s,
            "priority_score": base_priority,
            "waiting_bonus": bonus,
            "manual_boost": manual,
            "final_score": final_sc,
            "token": v.token or 999999,
            "arrival": v.create_at or q.create_at or datetime.now()
        })

    # Order: Final Score DESC, Token ASC, Arrival ASC
    items.sort(key=lambda x: (-x["final_score"], x["token"], x["arrival"]))

    # Recalculate 1-based positions and estimated wait times
    for i, it in enumerate(items):
        q_obj = it["queue"]
        q_obj.queue_position = i + 1
        q_obj.priority_score = it["priority_score"]
        q_obj.waiting_bonus = it["waiting_bonus"]
        q_obj.final_score = it["final_score"]
        q_obj.estimated_wait_time = current_serving_workload + FIRST_PATIENT_BUFFER_MIN + (i * avg_time)
        db.add(q_obj)

    db.commit()


def expire_stale_called(did: int, db: Session, stale_minutes: int = STALE_CALLED_MINUTES):
    """Real-world no-show guard: a Called patient who never enters the cabin
    within `stale_minutes` is moved back to Waiting (keeps manual boost +1
    skip) so one no-show never blocks the whole doctor lane."""
    today = date.today()
    moved = []
    stale_rows = db.query(Queue, Visit).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == did,
        Visit.visit_date == today,
        func.lower(Queue.status) == "called",
    ).all()
    now = datetime.now()
    for q, v in stale_rows:
        stamp = q.update_at or q.create_at
        if isinstance(stamp, str):
            try:
                stamp = datetime.fromisoformat(stamp)
            except Exception:
                continue
        if not stamp:
            continue
        elapsed = (now - stamp).total_seconds() / 60
        if elapsed >= stale_minutes:
            _set_status(q, v, STATUS_WAITING)
            q.skip_count = int(getattr(q, "skip_count", 0) or 0) + 1
            db.add(q)
            db.add(v)
            moved.append({"qid": q.qid, "token": v.token})
    if moved:
        db.commit()
        recalculate_doctor_queue(did, db)
    return moved


def call_next_patient(did: int, db: Session):
    """
    Selects highest final_score, earlier token/arrival.
    Waiting -> Called.
    Enforces concurrency lock & rule: One doctor cannot have two Called/Serving patients.
    """
    today = date.today()

    # Opportunistically release stale Called locks before refusing as busy.
    expire_stale_called(did, db)

    # Rule: One doctor cannot have two Called/Serving patients
    active_patient = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == did,
        Visit.visit_date == today,
        or_(func.lower(Queue.status) == "called", func.lower(Queue.status) == "serving")
    ).first()

    if active_patient:
        return {
            "status": "busy",
            "message": f"Doctor already has an active patient with status '{active_patient.status}'. Cannot call next until current consultation completes or is skipped.",
            "current_status": active_patient.status,
            "qid": active_patient.qid
        }

    # Recalculate aging and positions before picking
    recalculate_doctor_queue(did, db)

    # Concurrency safe row-lock on queue (Postgres FOR UPDATE; no-op on SQLite)
    query = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == did,
        Visit.visit_date == today,
        func.lower(Queue.status) == "waiting"
    ).order_by(
        Queue.final_score.desc(),
        Visit.token.asc(),
        Queue.create_at.asc()
    )
    try:
        next_item = query.with_for_update(skip_locked=True).first()
    except Exception:
        next_item = query.first()

    if not next_item:
        return {
            "status": "empty",
            "message": "No waiting patients in queue for this doctor."
        }

    visit = db.query(Visit).filter(Visit.vid == next_item.vid).first()
    if not _can_transition(next_item.status, STATUS_CALLED):
        return {"status": "error", "message": f"Cannot call patient from status '{next_item.status}'."}

    # Transition Waiting -> Called, persist Queue + Visit atomically
    try:
        _set_status(next_item, visit, STATUS_CALLED)
        db.add(next_item)
        if visit:
            db.add(visit)
        db.commit()
    except IntegrityError:
        db.rollback()
        return {"status": "error", "message": "Concurrent update conflict, please retry."}
    db.refresh(next_item)
    if visit:
        db.refresh(visit)

    # Recalculate remaining queue
    recalculate_doctor_queue(did, db)

    patient = db.query(Patient).filter(Patient.pid == visit.pid).first() if visit else None

    return {
        "status": "success",
        "message": f"Patient token #{visit.token if visit else next_item.vid} is now Called.",
        "qid": next_item.qid,
        "vid": next_item.vid,
        "token": visit.token if visit else None,
        "patient_name": patient.name if patient else "Patient",
        "patient_status": STATUS_CALLED
    }


def serve_patient(qid: int, db: Session):
    """
    Called -> Serving. Real-world rule: a patient must be Called first
    (they walk from waiting hall to cabin). Direct Waiting -> Serving is
    rejected to keep token announcement auditable.
    """
    q = db.query(Queue).filter(Queue.qid == qid).first()
    if not q:
        return {"status": "error", "message": "Queue record not found."}

    visit = db.query(Visit).filter(Visit.vid == q.vid).first()
    if not visit:
        return {"status": "error", "message": "Visit record not found."}

    if _norm(q.status) != "called":
        return {
            "status": "error",
            "message": f"Only a Called patient can start consultation (current: '{q.status}'). Call the patient first."
        }

    # Check if another patient is already serving for this doctor
    other_serving = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == visit.did,
        Visit.visit_date == visit.visit_date,
        Queue.qid != qid,
        func.lower(Queue.status) == "serving"
    ).first()

    if other_serving:
        return {
            "status": "busy",
            "message": "Doctor is already serving another patient."
        }

    _set_status(q, visit, STATUS_SERVING)

    db.commit()
    db.refresh(q)
    db.refresh(visit)

    recalculate_doctor_queue(visit.did, db)

    return {
        "status": "success",
        "message": f"Patient token #{visit.token} is now Serving.",
        "qid": q.qid,
        "token": visit.token,
        "status_name": STATUS_SERVING
    }


def complete_patient(qid: int, db: Session):
    """
    Serving (or Called, for a quick walk-in consult) -> Completed.
    Automatically calls the next waiting patient.
    """
    q = db.query(Queue).filter(Queue.qid == qid).first()
    if not q:
        return {"status": "error", "message": "Queue record not found."}

    visit = db.query(Visit).filter(Visit.vid == q.vid).first()
    if not visit:
        return {"status": "error", "message": "Visit record not found."}

    if _norm(q.status) not in ("serving", "called"):
        return {
            "status": "error",
            "message": f"Only Serving/Called consultations can be completed (current: '{q.status}')."
        }

    if not _can_transition(q.status, STATUS_COMPLETED):
        return {"status": "error", "message": f"Cannot complete from status '{q.status}'."}

    _set_status(q, visit, STATUS_COMPLETED)

    db.commit()
    db.refresh(q)
    db.refresh(visit)

    # Recalculate remaining queue
    recalculate_doctor_queue(visit.did, db)

    # Rule: On completion, automatically select and Call Next waiting patient
    auto_called = call_next_patient(visit.did, db)

    return {
        "status": "success",
        "message": f"Consultation for token #{visit.token} completed.",
        "token": visit.token,
        "auto_called": auto_called
    }


def skip_patient(qid: int, db: Session):
    """
    Waiting / Called -> Skipped. Serving patients cannot be skipped
    (they are already inside the cabin). skip_count tracks repeat
    no-shows: after 2 skips the patient is treated as a no-show and
    recalled with lower boost.
    """
    q = db.query(Queue).filter(Queue.qid == qid).first()
    if not q:
        return {"status": "error", "message": "Queue record not found."}

    visit = db.query(Visit).filter(Visit.vid == q.vid).first()
    if not visit:
        return {"status": "error", "message": "Visit record not found."}

    if _norm(q.status) == "serving":
        return {
            "status": "error",
            "message": "Patient is already in consultation and cannot be skipped. Complete or cancel instead."
        }
    if _norm(q.status) not in ("waiting", "called"):
        return {"status": "error", "message": f"Cannot skip from status '{q.status}'."}

    _set_status(q, visit, STATUS_SKIPPED)
    q.skip_count = int(getattr(q, "skip_count", 0) or 0) + 1

    db.commit()
    db.refresh(q)
    db.refresh(visit)

    recalculate_doctor_queue(visit.did, db)

    return {
        "status": "success",
        "message": f"Patient token #{visit.token} has been skipped.",
        "token": visit.token
    }


def cancel_patient(qid: int, db: Session):
    """Waiting / Called / Skipped -> Cancelled (patient left / wrong entry).

    Cancelled tokens are never auto-recalled and keep their number so the
    per-doctor token sequence stays gap-auditable.
    """
    q = db.query(Queue).filter(Queue.qid == qid).first()
    if not q:
        return {"status": "error", "message": "Queue record not found."}
    visit = db.query(Visit).filter(Visit.vid == q.vid).first()
    if not visit:
        return {"status": "error", "message": "Visit record not found."}
    if _norm(q.status) == "serving":
        return {"status": "error", "message": "Cannot cancel a consultation in progress."}
    if _norm(q.status) in ("completed", "cancelled"):
        return {"status": "error", "message": f"Already {q.status}, cannot cancel."}
    if not _can_transition(q.status, STATUS_CANCELLED):
        return {"status": "error", "message": f"Cannot cancel from status '{q.status}'."}

    _set_status(q, visit, STATUS_CANCELLED)
    db.commit()
    db.refresh(q)
    if visit:
        db.refresh(visit)
    recalculate_doctor_queue(visit.did, db)
    return {
        "status": "success",
        "message": f"Patient token #{visit.token} has been cancelled.",
        "token": visit.token,
    }


def recall_patient(qid: int, db: Session):
    """
    Recalls a skipped (or stale called) patient back into the lane.
    Boost is stored in manual_boost so recalculate_doctor_queue preserves
    it (old code added +20 to waiting_bonus and then wiped it on refresh).
    Repeat no-shows get a smaller boost so they go to the back fairly.
    """
    q = db.query(Queue).filter(Queue.qid == qid).first()
    if not q:
        return {"status": "error", "message": "Queue record not found."}

    visit = db.query(Visit).filter(Visit.vid == q.vid).first()
    if not visit:
        return {"status": "error", "message": "Visit record not found."}

    if _norm(q.status) not in ("skipped", "called", "cancelled", "waiting"):
        return {"status": "error", "message": f"Cannot recall from status '{q.status}'."}
    if _norm(q.status) == "cancelled":
        return {"status": "error", "message": "Cancelled tokens cannot be recalled. Register a new visit."}

    today = date.today()

    active_entry = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
        Visit.did == visit.did,
        Visit.visit_date == today,
        Queue.qid != qid,
        or_(func.lower(Queue.status) == "called", func.lower(Queue.status) == "serving")
    ).first()

    skips = int(getattr(q, "skip_count", 0) or 0)
    # First recall jumps near front (+20); repeat no-show goes to back (+5).
    recall_boost = 20 if skips <= 1 else 5
    q.manual_boost = int(getattr(q, "manual_boost", 0) or 0) + recall_boost

    if not active_entry:
        if not _can_transition(q.status, STATUS_CALLED):
            return {"status": "error", "message": f"Cannot recall from status '{q.status}'."}
        _set_status(q, visit, STATUS_CALLED)
    else:
        # Re-queue into waiting; recalc will order by preserved boost.
        if _norm(q.status) != "waiting" and not _can_transition(q.status, STATUS_WAITING):
            return {"status": "error", "message": f"Cannot recall from status '{q.status}'."}
        _set_status(q, visit, STATUS_WAITING)

    q.update_at = datetime.now()
    if visit:
        visit.update_at = datetime.now()

    db.commit()
    db.refresh(q)
    db.refresh(visit)

    recalculate_doctor_queue(visit.did, db)

    return {
        "status": "success",
        "message": f"Patient token #{visit.token} recalled as {q.status}.",
        "token": visit.token,
        "new_status": q.status
    }


def get_live_queue_board(db: Session, department: str = None, did: int = None):
    """
    Real-time board data grouped per doctor with:
    Now Serving | Called | Waiting | Token | Patient | Priority | Final Score | Estimated Wait | Queue Count.
    Pass did to recalculate + return only one lane (doctor/reception polling
    must not trigger a full-hospital recompute every 6 seconds).
    """
    today = date.today()

    doctors_q = db.query(Doctor).filter(
        or_(func.lower(Doctor.status) == "active", Doctor.status.is_(None))
    )
    if did is not None:
        doctors_q = doctors_q.filter(Doctor.did == did)
    doctors = doctors_q.all()
    if not doctors and did is None:
        doctors = db.query(Doctor).all()

    # Recalculate only the lanes we will return.
    lanes = []
    for doc in doctors:
        if department and department.lower() != "all":
            if not matches_specialization(doc.specialization, department):
                continue
        lanes.append(doc)
    for doc in lanes:
        recalculate_doctor_queue(doc.did, db)

    board = []

    for doc in lanes:
        rows = db.query(Queue, Visit, Patient, Symptoms_master).join(
            Visit, Queue.vid == Visit.vid
        ).join(
            Patient, Visit.pid == Patient.pid
        ).outerjoin(
            Symptoms_master, Visit.sid == Symptoms_master.sid
        ).filter(Visit.did == doc.did, Visit.visit_date == today).all()

        serving_item = None
        called_item = None
        waiting_items = []
        completed_items = []
        skipped_items = []
        cancelled_items = []

        seen_vids = set()

        for q, v, p, s in rows:
            if v.vid in seen_vids:
                continue
            seen_vids.add(v.vid)

            st = (q.status or STATUS_WAITING).strip().lower()

            item_data = {
                "qid": q.qid,
                "vid": v.vid,
                "did": doc.did,
                "token": v.token,
                "patient_id": p.pid,
                "patient_name": p.name,
                "patient_contact": p.contact,
                "dob": p.dob,
                "age": p.age,
                "gender": p.gender,
                "email": p.email,
                "address": p.address,
                "symptom_sid": s.sid if s else None,
                "symptom_name": s.symptom_name if s else "",
                "priority": s.priority if s else "Low",
                "priority_score": q.priority_score,
                "waiting_bonus": q.waiting_bonus or 0,
                "manual_boost": int(getattr(q, "manual_boost", 0) or 0),
                "skip_count": int(getattr(q, "skip_count", 0) or 0),
                "final_score": q.final_score or q.priority_score,
                "queue_position": q.queue_position,
                "estimated_wait_time": q.estimated_wait_time or 0,
                "status": q.status,
                "created_at": q.create_at.isoformat() if q.create_at else None,
                "updated_at": q.update_at.isoformat() if q.update_at else None
            }

            if st == "serving":
                if serving_item is None:
                    serving_item = item_data
            elif st == "called":
                if called_item is None:
                    called_item = item_data
                else:
                    # Data repair: never show two Called for one doctor.
                    waiting_items.append({**item_data, "status": STATUS_WAITING})
            elif st == "waiting":
                waiting_items.append(item_data)
            elif st == "completed":
                completed_items.append(item_data)
            elif st == "skipped":
                skipped_items.append(item_data)
            elif st in ("cancelled", "canceled"):
                cancelled_items.append(item_data)

        # Sort waiting items: final_score DESC, token ASC
        waiting_items.sort(key=lambda x: (-x["final_score"], x["token"] or 999999))

        board.append({
            "doctor": {
                "did": doc.did,
                "name": doc.name,
                "specialization": doc.specialization or "General Medicine",
                "avg_time": doc.avg_time or 10,
                "status": doc.status
            },
            "serving": serving_item,
            "called": called_item,
            "waiting": waiting_items,
            "completed_count": len(completed_items),
            "skipped": skipped_items,
            "cancelled_count": len(cancelled_items),
            "queue_count": len(waiting_items) + (1 if serving_item else 0) + (1 if called_item else 0)
        })

    return board
