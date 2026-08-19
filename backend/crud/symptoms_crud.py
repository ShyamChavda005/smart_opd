from models import Symptoms_master

def get_symptoms(db) :
    return db.query(Symptoms_master).all()


def add_symptoms(sym, db) :
    sympt = Symptoms_master(
        symptom_name = sym.symptom_name,
        priority = sym.priority, 
        priority_score = sym.priority_score,
        specialization = sym.specialization,
        is_active = sym.is_active
    )
    
    db.add(sympt)
    db.commit()
    db.refresh(sympt)
    
    return sympt


def update_symptoms(id, sym, db) :
    exist = db.query(Symptoms_master).filter(Symptoms_master.sid == id).first()
    
    if exist is None :
        return {"message" : "No Symptoms with this Id"}
    
    exist.symptom_name = sym.symptom_name
    exist.priority = sym.priority 
    exist.priority_score = sym.priority_score
    exist.specialization = sym.specialization
    exist.is_active = sym.is_active
    
    db.commit()
    db.refresh(exist)
    
    return exist


def update_status(id, status, db) :
    exist = db.query(Symptoms_master).filter(Symptoms_master.sid == id).first()
    
    if exist is None : 
        return {"message" : "No Symptoms with this Id"}
    
    exist.is_active = status
    
    db.commit()
    db.refresh(exist)
    
    return exist


def delete_symptoms(id, db) :
    exist = db.query(Symptoms_master).filter(Symptoms_master.sid == id).first()

    if exist is None : 
        return {"message" : "No Symptoms with this Id"}
    
    db.delete(exist)
    db.commit()
    
    return exist
