from models import Patient, Visit, Receptionist

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
    patients = db.query(Patient).all()
    registrations = (
        db.query(Visit.pid, Receptionist.rid, Receptionist.name, Visit.create_at)
        .join(Receptionist, Receptionist.rid == Visit.rid)
        .order_by(Visit.create_at.asc(), Visit.vid.asc())
        .all()
    )

    first_registration_by_patient = {}
    for registration in registrations:
        first_registration_by_patient.setdefault(registration.pid, registration)

    return [
        {
            "pid": patient.pid,
            "name": patient.name,
            "dob": patient.dob,
            "age": patient.age,
            "gender": patient.gender,
            "email": patient.email,
            "contact": patient.contact,
            "address": patient.address,
            "create_at": patient.create_at,
            "receptionist_id": (
                first_registration_by_patient.get(patient.pid).rid
                if first_registration_by_patient.get(patient.pid) else None
            ),
            "receptionist_name": (
                first_registration_by_patient.get(patient.pid).name
                if first_registration_by_patient.get(patient.pid) else "Not recorded"
            ),
        }
        for patient in patients
    ]


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
    