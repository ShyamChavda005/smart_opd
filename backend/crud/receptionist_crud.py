from models import Receptionist

def validate_receptionist(rec, db) :
    return db.query(Receptionist).filter(
        Receptionist.username == rec.username,
        Receptionist.password == rec.password
    ).first()
    

def add_receptionist(rec, db):
    receptionist = Receptionist(
        name = rec.name,
        dob = rec.dob,
        gender = rec.gender,
        email = rec.email,
        contact = rec.contact,
        username = rec.username,
        password = rec.password,
        shift = rec.shift,
        status = rec.status,
    )
    
    db.add(receptionist)
    db.commit()
    db.refresh(receptionist)
    
    return receptionist


def get_receptionist(db) :
    return db.query(Receptionist).all()


def get_one_receptionist(rid, db) :
    return db.query(Receptionist).filter(Receptionist.rid == rid).first()


def update_receptionist(rid, rec, db) :
    exist_rec = db.query(Receptionist).filter(Receptionist.rid == rid).first()
    
    if exist_rec is None :
        return {"message" : "No receptionist with this Id"}
    
    exist_rec.name = rec.name
    exist_rec.dob = rec.dob 
    exist_rec.gender = rec.gender 
    exist_rec.email = rec.email
    exist_rec.contact = rec.contact
    exist_rec.username = rec.username
    exist_rec.password = rec.password
    exist_rec.shift = rec.shift
    exist_rec.status = rec.status
    
    db.commit()
    db.refresh(exist_rec)
    
    return exist_rec


def delete_receptionist(rid, db) :
    exist_rec = db.query(Receptionist).filter(Receptionist.rid == rid).first()
    
    if exist_rec is None :
        return {"message" : "No receptionist with this Id"}
    
    db.delete(exist_rec)
    db.commit()
    
    return exist_rec
    