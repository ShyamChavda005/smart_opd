from models import Queue

def add_queue(que, db) :
    newQueue = Queue(
        vid = que.vid,
        queue_position = que.queue_position,
        priority_score = que.priority_score,
        waiting_bonus = que.waiting_bonus,
        final_score = que.final_score,
        estimated_wait_time = que.estimated_wait_time,
        status = que.status
    )
    
    db.add(newQueue)
    db.commit()
    db.refresh(newQueue)
    
    return newQueue


def get_queues(db) :
    return db.query(Queue).all()


def get_one_queue(qid, db) :
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    
    if exits_queue is None :
        return {"message" : "No queue item found with this Id"}
        
    return exits_queue


def update_queue(qid, que, db) :
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    
    if exits_queue is None :
        return {"message" : "No queue item found with this Id"}
        
    exits_queue.vid = que.vid
    exits_queue.queue_position = que.queue_position
    exits_queue.priority_score = que.priority_score
    exits_queue.waiting_bonus = que.waiting_bonus
    exits_queue.final_score = que.final_score
    exits_queue.estimated_wait_time = que.estimated_wait_time
    exits_queue.status = que.status
    
    db.commit()
    db.refresh(exits_queue)
    
    return exits_queue


def delete_queue(qid, db) :
    exits_queue = db.query(Queue).filter(Queue.qid == qid).first()
    
    if exits_queue is None :
        return {"message" : "No queue item found with this Id"}
        
    db.delete(exits_queue)
    db.commit()
    
    return exits_queue
