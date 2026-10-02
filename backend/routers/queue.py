from fastapi import APIRouter, Depends, HTTPException, Query, status
from services import queue_services
from sqlalchemy.orm import Session
from database import get_db
from schemas import QueueValidate
from typing import Optional
from auth import get_current_user

router = APIRouter()


def require_doctor(user: dict = Depends(get_current_user)):
    if user.get("role") != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can start or complete consultations.",
        )
    return user

@router.get("/queues")
def get_queues(today_only: bool = Query(False), db: Session = Depends(get_db)):
    return queue_services.get_queues(db, today_only=today_only)


@router.get("/queues/board")
def get_queue_board(
    department: Optional[str] = Query(None),
    did: Optional[int] = Query(None, description="Single doctor lane; avoids full-hospital recompute"),
    db: Session = Depends(get_db),
):
    return queue_services.get_live_queue_board(db, department, did)


@router.post("/queue/call-next/{did}")
def call_next_patient(did: int, db: Session = Depends(get_db)):
    return queue_services.call_next_patient(did, db)


@router.post("/queue/serve/{qid}")
def serve_patient(qid: int, db: Session = Depends(get_db), user: dict = Depends(require_doctor)):
    return queue_services.serve_patient(qid, db)


@router.post("/queue/complete/{qid}")
def complete_patient(qid: int, db: Session = Depends(get_db), user: dict = Depends(require_doctor)):
    return queue_services.complete_patient(qid, db)


@router.post("/queue/skip/{qid}")
def skip_patient(qid: int, db: Session = Depends(get_db)):
    return queue_services.skip_patient(qid, db)


@router.post("/queue/recall/{qid}")
def recall_patient(qid: int, db: Session = Depends(get_db)):
    return queue_services.recall_patient(qid, db)


@router.post("/queue/cancel/{qid}")
def cancel_patient(qid: int, db: Session = Depends(get_db)):
    """Real world: patient left / wrong entry / duplicate. Frees the lane."""
    return queue_services.cancel_patient(qid, db)


@router.post("/queue/expire-stale/{did}")
def expire_stale_called(
    did: int,
    stale_minutes: int = Query(15, ge=1, le=120),
    db: Session = Depends(get_db),
):
    """Move Called-but-never-arrived patients back to Waiting (no-show guard)."""
    return {"moved_back": queue_services.expire_stale_called(did, db, stale_minutes)}


@router.post("/queue/recalculate/{did}")
def recalculate_queue(did: int, db: Session = Depends(get_db)):
    queue_services.recalculate_doctor_queue(did, db)
    return {"status": "success", "message": f"Queue recalculated for doctor {did}."}


@router.get("/queue/{id}")
def get_one_queue(id: int, db: Session = Depends(get_db)):
    return queue_services.get_one_queue(id, db)


@router.post("/queue")
def add_queue(que: QueueValidate, db: Session = Depends(get_db)):
    success = queue_services.add_queue(que, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Queue Item Added !"}


@router.put("/queue/{id}")
def update_queue(id: int, que: QueueValidate, db: Session = Depends(get_db)):
    success = queue_services.update_queue(id, que, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Queue Item Updated !"}


@router.delete("/queue/{id}")
def delete_queue(id: int, db: Session = Depends(get_db)):
    success = queue_services.delete_queue(id, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Queue Item Deleted !"}
