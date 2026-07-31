from fastapi import APIRouter, Depends
from schemas import DoctorValidate, DoctorLoginValidate
from database import get_db
from sqlalchemy.orm import Session
from services import doctor_services

router = APIRouter()

@router.post("/login/doctor")
def validate_doctor(doc : DoctorLoginValidate, db: Session = Depends(get_db)) :
    success = doctor_services.validate_doctor(doc, db)    
    
    if not success :
        return {"message" : "Login failed"}
    
    return {"message" : "Login successful", "id": success.did}
        

@router.post("/doctor")
def add_doctor(doc : DoctorValidate, db : Session = Depends(get_db)) :
    success = doctor_services.add_doctor(doc, db)

    if not success :
        return {"message" : "something wrong.."}
    
    return {"message" : "Doctor added !"}
        

@router.get("/doctors")
def get_doctors(db: Session = Depends(get_db)) :
    return doctor_services.get_doctors(db)


@router.get("/doctor/{id}") 
def get_one_doctor(id, db : Session = Depends(get_db)) :
    return doctor_services.get_one_doctor(id, db)


@router.put("/doctor/{id}")
def update_doctor(id: int, doc: DoctorValidate, db : Session = Depends(get_db)) :
    success = doctor_services.update_doctor(id, doc, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Doctor Updated !"}


@router.delete("/doctor/{id}")
def delete_doctor(id: int, db: Session = Depends(get_db)) :
    success = doctor_services.delete_doctor(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Doctor Deleted !"}