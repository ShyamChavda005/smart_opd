from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from services import symptoms_services
from schemas import Symptoms_masterValidate

router = APIRouter()

@router.get("/symptoms")
def get_symptoms(db : Session = Depends(get_db)) :
    return symptoms_services.get_symptoms(db)


@router.post("/symptoms")
def add_symtoms(sym : Symptoms_masterValidate, db : Session = Depends(get_db)) :
    return symptoms_services.add_symptoms(sym, db)


@router.put("/symptoms/{id}")
def update_symptoms(id : int, sym : Symptoms_masterValidate, db : Session = Depends(get_db)) :
    return symptoms_services.update_symptoms(id, sym, db)


@router.patch("/symptoms/{id}/{status}")
def update_symptoms_status(id : int, status : str, db : Session = Depends(get_db)) :
    return symptoms_services.update_symptoms_status(id, status, db)


@router.delete("/symptoms/{id}") 
def delete_symptoms(id : int, db : Session = Depends(get_db)) :
    return symptoms_services.delete_symtoms(id, db)