from crud import queue_crud

def add_queue(que, db) :
    return queue_crud.add_queue(que, db)

def get_queues(db) :
    return queue_crud.get_queues(db)

def get_one_queue(id, db) :
    return queue_crud.get_one_queue(id, db)

def update_queue(id, que, db) :
    return queue_crud.update_queue(id, que, db)

def delete_queue(id, db) :
    return queue_crud.delete_queue(id, db)
