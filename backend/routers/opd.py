from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from schemas import OPDRegisterValidate
from services import opd_services

router = APIRouter()

@router.get("/opd/doctors-queue/{specialization}")
def get_doctors_queue(specialization: str, db: Session = Depends(get_db)) :
    return opd_services.get_doctors_with_queue(specialization, db)


@router.post("/opd/register")
def register_opd(
    data: OPDRegisterValidate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
) :
    return opd_services.register_opd_patient(data, db, user.get("uid") or user.get("id"))
