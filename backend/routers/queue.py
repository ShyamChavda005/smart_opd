from fastapi import APIRouter, Depends
from services import queue_services
from sqlalchemy.orm import Session
from database import get_db
from schemas import QueueValidate

router = APIRouter()

@router.get("/queues")
def get_queues(db : Session = Depends(get_db)) :
    return queue_services.get_queues(db)


@router.get("/queue/{id}")
def get_one_queue(id, db : Session = Depends(get_db)) :
    return queue_services.get_one_queue(id, db)


@router.post("/queue")
def add_queue(que : QueueValidate, db : Session = Depends(get_db)) :
    success = queue_services.add_queue(que, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Queue Item Added !"}


@router.put("/queue/{id}")
def update_queue(id : int, que : QueueValidate, db : Session = Depends(get_db)) :
    success = queue_services.update_queue(id, que, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Queue Item Updated !"}


@router.delete("/queue/{id}")
def delete_queue(id : int, db : Session = Depends(get_db)) :
    success = queue_services.delete_queue(id, db)
    
    if not success :
        return {"message" : "something wrong.."}
        
    return {"message" : "Queue Item Deleted !"}
