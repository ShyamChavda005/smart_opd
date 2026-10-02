from models import Visit

def add_visit(vis, db) :
    newVisit = Visit(
        pid = vis.pid,
        did = vis.did,
        rid = vis.rid,
        sid = vis.sid,
        token = vis.token,
        visit_date = vis.visit_date,
        status = vis.status
    )
    
    db.add(newVisit)
    db.commit()
    db.refresh(newVisit)
    
    return newVisit


def get_visits(db) :
    return db.query(Visit).all()


def get_one_visit(vid, db) :
    exits_visit = db.query(Visit).filter(Visit.vid == vid).first()
    
    if exits_visit is None :
        return {"message" : "No visit found with this Id"}
        
    return exits_visit


def update_visit(vid, vis, db) :
    exits_visit = db.query(Visit).filter(Visit.vid == vid).first()
    
    if exits_visit is None :
        return {"message" : "No visit found with this Id"}
        
    exits_visit.pid = vis.pid
    exits_visit.did = vis.did
    exits_visit.rid = vis.rid
    exits_visit.sid = vis.sid
    exits_visit.token = vis.token
    exits_visit.visit_date = vis.visit_date
    exits_visit.status = vis.status
    
    db.commit()
    db.refresh(exits_visit)
    
    return exits_visit


def update_visit_symptom(vid, sid, db) :
    from models import Queue, Symptoms_master
    exits_visit = db.query(Visit).filter(Visit.vid == vid).first()

    if exits_visit is None :
        return None

    exits_visit.sid = sid
    db.add(exits_visit)
    db.commit()
    db.refresh(exits_visit)

    # Real-world fix: symptom edit while Waiting must re-score the queue lane.
    # Otherwise an upgraded Emergency patient keeps their old Low priority.
    try:
        from crud import queue_crud
        if str(exits_visit.status or "").strip().lower() == "waiting":
            queue_crud.recalculate_doctor_queue(exits_visit.did, db)
    except Exception:
        pass

    return exits_visit


def delete_visit(vid, db) :
    exits_visit = db.query(Visit).filter(Visit.vid == vid).first()
    
    if exits_visit is None :
        return {"message" : "No visit found with this Id"}
        
    db.delete(exits_visit)
    db.commit()
    
    return exits_visit
