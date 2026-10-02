from crud import queue_crud

def add_queue(que, db):
    return queue_crud.add_queue(que, db)

def get_queues(db, today_only: bool = False):
    return queue_crud.get_queues(db, today_only=today_only)

def get_one_queue(id, db):
    return queue_crud.get_one_queue(id, db)

def update_queue(id, que, db):
    return queue_crud.update_queue(id, que, db)

def delete_queue(id, db):
    return queue_crud.delete_queue(id, db)

def call_next_patient(did: int, db):
    return queue_crud.call_next_patient(did, db)

def serve_patient(qid: int, db):
    return queue_crud.serve_patient(qid, db)

def complete_patient(qid: int, db):
    return queue_crud.complete_patient(qid, db)

def skip_patient(qid: int, db):
    return queue_crud.skip_patient(qid, db)

def recall_patient(qid: int, db):
    return queue_crud.recall_patient(qid, db)

def cancel_patient(qid: int, db):
    return queue_crud.cancel_patient(qid, db)

def expire_stale_called(did: int, db, stale_minutes: int = 15):
    return queue_crud.expire_stale_called(did, db, stale_minutes)

def get_live_queue_board(db, department: str = None, did: int = None):
    return queue_crud.get_live_queue_board(db, department, did)

def recalculate_doctor_queue(did: int, db):
    return queue_crud.recalculate_doctor_queue(did, db)
