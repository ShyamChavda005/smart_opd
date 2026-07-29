from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from schemas import ReceptionistValidate, ReceptionistLoginValidate
from services import receptionist_services

router = APIRouter()

@router.post("/login/receptionist")
def validate_receptionist(rec : ReceptionistLoginValidate, db : Session = Depends(get_db)) :
    success = receptionist_services.validate_receptionist(rec, db)
    
    if not success :
        return {"message" : "Login failed"}
    
    return {"message" : "Login successful"}


@router.post("/receptionist")
def add_receptionist(rec : ReceptionistValidate, db : Session = Depends(get_db)) :
    success = receptionist_services.add_receptionist(rec, db)
    
    if not success :
        return {"message" : "something wrong.."}
    
    return {"message" : "Receptionist Added !"}


@router.get("/receptionists")
def get_receptionists(db: Session = Depends(get_db)) :
    return receptionist_services.get_receptionist(db)


@router.get("/receptionist/{id}")
def get_one_receptionist(id, db: Session = Depends(get_db)) :
    return receptionist_services.get_one_receptionist(id, db)


@router.put("/receptionist/{id}")
def update_receptionist(id : int, rec : ReceptionistValidate, db : Session = Depends(get_db)):
    success = receptionist_services.update_receptionist(id, rec, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Receptionist Updated !"}


@router.delete("/receptionist/{id}")
def delete_receptionist(id: int, db: Session = Depends(get_db)) :
    success = receptionist_services.delete_receptionist(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
    
    return {"message" : "Receptionist Deleted !"}