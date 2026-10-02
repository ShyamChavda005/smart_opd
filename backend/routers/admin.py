from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import admin_services
from schemas import AdminValidate, AdminLoginValidate
from auth import create_token, get_current_user

router = APIRouter()

@router.get("/admin")
def get_admin(db : Session = Depends(get_db)) :
    return admin_services.get_admin(db)

@router.get("/admin/me")
def get_current_admin(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    ad = admin_services.get_admin(db)
    if not ad:
        return {"error": "Admin not found"}
    return ad[0]

@router.put("/admin/me")
def update_current_admin(newData: AdminValidate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    admin_id = user.get("uid")
    success = admin_services.update_admin(admin_id, newData, db)
    if not success:
        return {"message": "something wrong.."}
    return {"message": "Admin Updated !"}

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
    
    token = create_token(success.id, role="admin", username=getattr(success, "username", ""))
    return {"message" : "Login successful", "token" : token}