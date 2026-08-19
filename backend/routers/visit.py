from fastapi import APIRouter, Depends
from services import visit_services
from sqlalchemy.orm import Session
from database import get_db
from schemas import VisitValidate

router = APIRouter()

@router.get("/visits")
def get_visits(db : Session = Depends(get_db)) :
    return visit_services.get_visits(db)


@router.get("/visit/{id}")
def get_one_visit(id, db : Session = Depends(get_db)) :
    return visit_services.get_one_visit(id, db)


@router.post("/visit")
def add_visit(vis : VisitValidate, db : Session = Depends(get_db)) :
    success = visit_services.add_visit(vis, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Visit Added !"}


@router.put("/visit/{id}")
def update_visit(id : int, vis : VisitValidate, db : Session = Depends(get_db)) :
    success = visit_services.update_visit(id, vis, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Visit Updated !"}


@router.delete("/visit/{id}")
def delete_visit(id : int, db : Session = Depends(get_db)) :
    success = visit_services.delete_visit(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Visit Deleted !"}
