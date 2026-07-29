from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import admin_services
from schemas import AdminValidate, AdminLoginValidate

router = APIRouter()

@router.get("/admin")
def get_admin(db : Session = Depends(get_db)) :
    return admin_services.get_admin(db)


@router.put("/admin/{id}")
def update_admin(id: int, newData : AdminValidate, db: Session = Depends(get_db)) :
    success = admin_services.update_admin(id, newData, db)
    
    if not success :
        return {"message" : "something wrong.."}
    
    return {"message" : "Admin Updated !"}


@router.post("/login/admin")
def validate_admin(ad : AdminLoginValidate, db : Session = Depends(get_db)) :
    success = admin_services.validate_admin(ad, db)
    
    if success is None :
        return {"message" : "Login Failed"}
    
    return {"message" : "Login successful"}