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


def delete_visit(vid, db) :
    exits_visit = db.query(Visit).filter(Visit.vid == vid).first()
    
    if exits_visit is None :
        return {"message" : "No visit found with this Id"}
        
    db.delete(exits_visit)
    db.commit()
    
    return exits_visit
