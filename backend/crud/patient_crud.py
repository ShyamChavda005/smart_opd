from models import Patient

def add_patient(pat, db) :
    newPat = Patient(
        name = pat.name,
        dob = pat.dob,
        age = pat.age,
        gender = pat.gender,
        email = pat.email,
        contact = pat.contact,
        address = pat.address,
    )
    
    db.add(newPat)
    db.commit()
    db.refresh(newPat)
    
    return newPat


def get_patients(db):
    return db.query(Patient).all()


def get_one_patient(pid, db) :
    exits_patient = db.query(Patient).filter(Patient.pid == pid).first()
    
    if exits_patient is None :
        return {"message" : "No patient found with this Id"}
    
    return exits_patient


def update_patient(pid, pat, db) :
    exits_patient = db.query(Patient).filter(Patient.pid == pid).first()
    
    if exits_patient is None :
        return {"message" : "No patient found with this Id"}
    
    exits_patient.name = pat.name
    exits_patient.dob = pat.dob
    exits_patient.age = pat.age
    exits_patient.gender = pat.gender
    exits_patient.email = pat.email
    exits_patient.contact = pat.contact
    exits_patient.address = pat.address
    
    db.commit()
    db.refresh(exits_patient)
    
    return exits_patient


def delete_patient(pid, db) :
    exits_patient = db.query(Patient).filter(Patient.pid == pid).first()
    
    if exits_patient is None :
        return {"message" : "No patient found with this Id"}
    
    db.delete(exits_patient)
    db.commit()
    
    return exits_patient
    