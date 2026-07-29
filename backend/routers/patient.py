from fastapi import APIRouter, Depends
from services import patient_services
from sqlalchemy.orm import Session
from database import get_db
from schemas import PatientValidate

router = APIRouter()

@router.get("/patients")
def get_patients(db : Session = Depends(get_db)) :
    return patient_services.get_patients(db)


@router.get("/patient/{id}")
def get_one_patient(id, db: Session = Depends(get_db)) :
    return patient_services.get_one_patient(id, db)


@router.post("/patient") 
def add_patient(pat: PatientValidate, db : Session = Depends(get_db)) :
    success = patient_services.add_patinet(pat, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Patient Added !"}


@router.put("/patient/{id}") 
def update_patient(id: int, pat: PatientValidate, db : Session = Depends(get_db)) :
    success = patient_services.update_patient(id, pat, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Patient Updated !"}


@router.delete("/patient/{id}") 
def delete_patient(id: int, db : Session = Depends(get_db)) :
    success = patient_services.delete_patient(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Patient Deleted !"}

