from fastapi import APIRouter, Depends
from schemas import DoctorValidate, DoctorLoginValidate
from database import get_db
from sqlalchemy.orm import Session
from services import doctor_services
from auth import create_token, get_current_user

router = APIRouter()

@router.post("/login/doctor")
def validate_doctor(doc : DoctorLoginValidate, db: Session = Depends(get_db)) :
    success = doctor_services.validate_doctor(doc, db)    
    
    if not success :
        return {"message" : "Login failed"}
    
    token = create_token(success.did, role="doctor", username=getattr(success, "username", ""))
    return {"message" : "Login successful", "token": token, "status" : success.status}


@router.get("/doctor/me")
def get_current_doctor(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = doctor_services.get_one_doctor(user.get("uid"), db)
    if not doc:
        all_docs = doctor_services.get_doctors(db)
        if all_docs:
            for d in all_docs:
                if getattr(d, 'username', None) == user.get('username'):
                    return d
            return all_docs[0]
        return {"error": "Doctor not found"}
    return doc


@router.put("/doctor/me")
def update_current_doctor(doc: DoctorValidate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    success = doctor_services.update_doctor(user.get("uid"), doc, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Doctor Updated !"}


@router.post("/doctor")
def add_doctor(doc : DoctorValidate, db : Session = Depends(get_db)) :
    success = doctor_services.add_doctor(doc, db)

    if not success :
        return {"message" : "something wrong.."}
    
    return success


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


@router.patch("/doctor/{id}/{status}")
def update_doctor_status(id : int, status: str, db : Session = Depends(get_db)) :
    return doctor_services.update_doctor_status(id, status, db)


@router.delete("/doctor/{id}")
def delete_doctor(id: int, db: Session = Depends(get_db)) :
    success = doctor_services.delete_doctor(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Doctor Deleted !"}