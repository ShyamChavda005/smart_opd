from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from schemas import ReceptionistValidate, ReceptionistLoginValidate
from services import receptionist_services
from auth import create_token, get_current_user

router = APIRouter()

@router.post("/login/receptionist")
def validate_receptionist(rec : ReceptionistLoginValidate, db : Session = Depends(get_db)) :
    success = receptionist_services.validate_receptionist(rec, db)
    
    if not success :
        return {"message" : "Login failed"}
    
    token = create_token(success.rid, role="receptionist", username=getattr(success, "username", ""))
    return {"message" : "Login successful", "token": token, "status" : success.status}


@router.get("/receptionist/me")
def get_current_receptionist(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = receptionist_services.get_one_receptionist(user.get("uid"), db)
    if not rec:
        all_recs = receptionist_services.get_receptionist(db)
        if all_recs:
            for r in all_recs:
                if getattr(r, 'username', None) == user.get('username'):
                    return r
            return all_recs[0]
        return {"error": "Receptionist not found"}
    return rec


@router.put("/receptionist/me")
def update_current_receptionist(rec: ReceptionistValidate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    success = receptionist_services.update_receptionist(user.get("uid"), rec, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Receptionist Updated !"}


@router.post("/receptionist")
def add_receptionist(rec : ReceptionistValidate, db : Session = Depends(get_db)) :
    success = receptionist_services.add_receptionist(rec, db)
    
    if not success :
        return {"message" : "something wrong.."}
    
    return success


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
        
    return {"message" : "Receptionist updated !"}


@router.patch("/receptionist/{id}/{status}")
def update_doctor_status(id : int, status: str, db : Session = Depends(get_db)) :
    return receptionist_services.update_receptionist_status(id, status, db)



@router.delete("/receptionist/{id}")
def delete_receptionist(id : int, db: Session = Depends(get_db)) :
    success = receptionist_services.delete_receptionist(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Receptionist Deleted !"}