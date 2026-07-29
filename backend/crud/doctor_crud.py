from models import Doctor

def validate_doctor(doc, db) :
    return db.query(Doctor).filter(
        Doctor.username == doc.username,
        Doctor.password == doc.password
        ).first()


def add_doctor(doc, db) :
    newDoc = Doctor(
        name = doc.name,
        dob = doc.dob,
        gender = doc.gender,
        email = doc.email,
        contact = doc.contact,
        specialization = doc.specialization,
        avg_time = doc.avg_time,
        username = doc.username,
        password = doc.password,
        status = doc.status,
    )
    
    db.add(newDoc)
    db.commit()
    db.refresh(newDoc)
    
    return newDoc


def get_doctors(db) :
    return db.query(Doctor).all()


def get_one_doctor(did, db) :
    return db.query(Doctor).filter(Doctor.did == did).first()


def update_doctor(did, doc, db) :
    exits_doctor =  db.query(Doctor).filter(Doctor.did == did).first()
    
    if exits_doctor is None :
        return {"message" : "No Doctor with this Id"}
    
    exits_doctor.name = doc.name
    exits_doctor.dob = doc.dob
    exits_doctor.gender = doc.gender
    exits_doctor.email = doc.email
    exits_doctor.contact = doc.contact
    exits_doctor.specialization = doc.specialization
    exits_doctor.avg_time = doc.avg_time
    exits_doctor.username = doc.username
    exits_doctor.password = doc.password
    exits_doctor.status = doc.status
    
    db.commit()
    db.refresh(exits_doctor)
    
    return exits_doctor
    
    
def delete_doctor(did, db) :
    exits_doctor = db.query(Doctor).filter(Doctor.did == did).first()
    
    if exits_doctor is None :
        return {"message" : "Doctos not found with this Id"}
    
    db.delete(exits_doctor)
    db.commit()
    
    return exits_doctor