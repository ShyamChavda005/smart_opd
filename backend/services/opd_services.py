from models import Patient, Doctor, Symptoms_master, Visit, Queue, Receptionist
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from crud import queue_crud
from mail import send_token_email

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

def get_doctors_with_queue(specialization: str, db: Session):
    # Fetch all active doctors (case-insensitive status check or None)
    doctors = db.query(Doctor).filter(
        or_(func.lower(Doctor.status) == "active", Doctor.status.is_(None))
    ).all()
    if not doctors:
        doctors = db.query(Doctor).all()

    # Filter by specialization if possible
    filtered_doctors = [
        d for d in doctors
        if matches_specialization(d.specialization, specialization)
    ]
    if not filtered_doctors:
        filtered_doctors = doctors  # Fallback to all active doctors if no specialization match

    doc_list = []
    today = date.today()

    for doc in filtered_doctors:
        # Recalculate queue for fresh ordering and wait times
        queue_crud.recalculate_doctor_queue(doc.did, db)

        waiting_count = db.query(Visit).join(Queue, Visit.vid == Queue.vid).filter(
            Visit.did == doc.did,
            Visit.visit_date == today,
            func.lower(Queue.status) == "waiting"
        ).count()

        has_active = db.query(Queue).join(Visit, Queue.vid == Visit.vid).filter(
            Visit.did == doc.did,
            Visit.visit_date == today,
            or_(func.lower(Queue.status) == "serving", func.lower(Queue.status) == "called")
        ).first() is not None

        avg = doc.avg_time or 10
        # Same formula as recalculate_doctor_queue: active remainder + buffer + queue.
        active_workload = queue_crud._current_serving_workload(doc.did, today, avg, db)
        total_workload = active_workload + queue_crud.FIRST_PATIENT_BUFFER_MIN + (waiting_count * avg)

        # Next token for this doctor (per-doctor per-day sequence).
        next_token = queue_crud.next_token_for_doctor(doc.did, today, db)

        doc_list.append({
            "did": doc.did,
            "name": doc.name,
            "specialization": doc.specialization or "General",
            "avg_time": avg,
            "queue_count": waiting_count + (1 if has_active else 0),
            "waiting_count": waiting_count,
            "estimated_wait_time": total_workload,
            "next_token": next_token,
        })

    # Recommend doctor using lowest current workload/wait
    doc_list.sort(key=lambda x: (x["estimated_wait_time"], x["queue_count"]))

    for idx, d in enumerate(doc_list):
        d["is_recommended"] = (idx == 0)

    return doc_list


def _queue_payload_for_visit(new_queue, assigned_doctor, p_level, p_score, already_registered: bool):
    return {
        "message": "Patient already has an active token for this doctor today." if already_registered else "OPD Registration Successful!",
        "already_registered": already_registered,
        "token": new_queue_token(new_queue),
        "patient_id": None,  # filled by caller
        "patient_name": None,  # filled by caller
        "doctor_id": assigned_doctor.did,
        "doctor_name": assigned_doctor.name,
        "specialization": assigned_doctor.specialization,
        "queue_position": new_queue.queue_position,
        "estimated_wait_time": new_queue.estimated_wait_time,
        "priority": p_level,
        "priority_score": p_score,
        "waiting_bonus": new_queue.waiting_bonus,
        "final_score": new_queue.final_score
    }


def new_queue_token(new_queue):
    # token lives on Visit; caller patches it in (kept separate for clarity).
    return getattr(new_queue, "_token", None)


def register_opd_patient(data, db: Session, receptionist_id=None):
    today = date.today()
    now_time = datetime.now()
    email_val = data.email.strip()

    # 1. Find or create patient
    contact_val = data.contact.strip() if data.contact else "0000000000"
    exist_pat = db.query(Patient).filter(Patient.contact == contact_val).first()

    if exist_pat:
        patient = exist_pat
        patient.name = data.name
        patient.email = email_val
        patient.address = data.address
        db.commit()
        db.refresh(patient)
    else:
        patient = Patient(
            name=data.name,
            dob=data.dob,
            age=data.age,
            gender=data.gender,
            email=email_val,
            contact=contact_val,
            address=data.address,
            create_at=now_time
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    # 2. Lookup symptom details
    symptom = db.query(Symptoms_master).filter(Symptoms_master.sid == data.sid).first()
    if not symptom:
        symptom = db.query(Symptoms_master).first()

    sid_val = symptom.sid if symptom else 1
    p_score = symptom.priority_score if symptom else 10
    p_level = symptom.priority if symptom else "Low"

    # 3. Use the authenticated receptionist for registration attribution.
    rec = db.query(Receptionist).filter(Receptionist.rid == receptionist_id).first()
    if not rec:
        rec = db.query(Receptionist).filter(Receptionist.rid == data.rid).first()
    if not rec:
        rec = db.query(Receptionist).first()
    rid_val = rec.rid if rec else 1

    # 4. Determine assigned doctor (only Active doctors; inactive = on leave).
    assigned_doctor = None
    if data.did:
        assigned_doctor = db.query(Doctor).filter(Doctor.did == data.did).first()
        if assigned_doctor and str(assigned_doctor.status or "Active").lower() != "active":
            return {"message": f"{assigned_doctor.name} is not available today (status: {assigned_doctor.status}). Please choose another doctor."}

    if not assigned_doctor:
        target_spec = symptom.specialization if (symptom and getattr(symptom, 'specialization', None)) else data.specialization
        avail_docs = get_doctors_with_queue(target_spec, db)
        # get_doctors_with_queue only returns active doctors already.
        if avail_docs:
            best_doc_id = avail_docs[0]["did"]
            assigned_doctor = db.query(Doctor).filter(Doctor.did == best_doc_id).first()

    if not assigned_doctor:
        assigned_doctor = db.query(Doctor).filter(
            or_(func.lower(Doctor.status) == "active", Doctor.status.is_(None))
        ).first() or db.query(Doctor).first()

    if not assigned_doctor:
        return {"message": "No doctor available in database"}

    # 5. Real-world guard: same patient + same doctor + today + still active
    #    -> return the existing token instead of creating a duplicate visit.
    existing_active = queue_crud.find_active_visit(patient.pid, assigned_doctor.did, today, db)
    if existing_active:
        existing_queue = db.query(Queue).filter(Queue.vid == existing_active.vid).first()
        if existing_queue:
            queue_crud.recalculate_doctor_queue(assigned_doctor.did, db)
            db.refresh(existing_queue)
            return {
                "message": f"{patient.name} already has active token #{existing_active.token} for {assigned_doctor.name} today.",
                "already_registered": True,
                "token": existing_active.token,
                "patient_id": patient.pid,
                "patient_name": patient.name,
                "doctor_id": assigned_doctor.did,
                "doctor_name": assigned_doctor.name,
                "specialization": assigned_doctor.specialization,
                "queue_position": existing_queue.queue_position,
                "estimated_wait_time": existing_queue.estimated_wait_time,
                "priority": p_level,
                "priority_score": existing_queue.priority_score,
                "waiting_bonus": existing_queue.waiting_bonus,
                "final_score": existing_queue.final_score,
                "email_sent": send_token_email(
                    patient.email,
                    patient.name,
                    existing_active.token,
                    assigned_doctor.name,
                    assigned_doctor.specialization or "General Medicine",
                    existing_queue.queue_position,
                    existing_queue.estimated_wait_time,
                    p_level,
                ),
            }

    # 6. Per-doctor per-day sequential token (race-safe retry on collision).
    new_visit = None
    token_num = queue_crud.next_token_for_doctor(assigned_doctor.did, today, db)
    for attempt in range(3):
        try:
            new_visit = Visit(
                pid=patient.pid,
                did=assigned_doctor.did,
                rid=rid_val,
                sid=sid_val,
                token=token_num,
                visit_date=today,
                status="Waiting",
                create_at=now_time,
                update_at=now_time
            )
            db.add(new_visit)
            db.flush()  # get vid without committing Visit alone

            new_queue = Queue(
                vid=new_visit.vid,
                queue_position=0,  # fixed by recalc below
                priority_score=p_score,
                waiting_bonus=0,
                manual_boost=0,
                skip_count=0,
                final_score=p_score,
                estimated_wait_time=0,
                status="Waiting",
                create_at=now_time,
                update_at=now_time
            )
            db.add(new_queue)
            db.commit()
            db.refresh(new_visit)
            db.refresh(new_queue)
            break
        except IntegrityError:
            db.rollback()
            # Token taken by a parallel registration -> take the next number.
            token_num = queue_crud.next_token_for_doctor(assigned_doctor.did, today, db) + attempt + 1
            new_visit = None
    if new_visit is None:
        return {"message": "Registration conflict: please retry (parallel token issue)."}

    # Recalculate queue positions, scores and wait times dynamically
    queue_crud.recalculate_doctor_queue(assigned_doctor.did, db)
    db.refresh(new_queue)

    email_sent = send_token_email(
        patient.email,
        patient.name,
        token_num,
        assigned_doctor.name,
        assigned_doctor.specialization or "General Medicine",
        new_queue.queue_position,
        new_queue.estimated_wait_time,
        p_level,
    )

    return {
        "message": "OPD Registration Successful!",
        "already_registered": False,
        "token": token_num,
        "patient_id": patient.pid,
        "patient_name": patient.name,
        "doctor_id": assigned_doctor.did,
        "doctor_name": assigned_doctor.name,
        "specialization": assigned_doctor.specialization,
        "queue_position": new_queue.queue_position,
        "estimated_wait_time": new_queue.estimated_wait_time,
        "priority": p_level,
        "priority_score": p_score,
        "waiting_bonus": new_queue.waiting_bonus,
        "final_score": new_queue.final_score,
        "email_sent": email_sent,
    }
