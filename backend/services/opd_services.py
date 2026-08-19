from models import Patient, Doctor, Symptoms_master, Visit, Queue, Receptionist
from datetime import date, datetime
from sqlalchemy.orm import Session

def get_doctors_with_queue(specialization: str, db: Session) :
    # Fetch all active doctors
    doctors = db.query(Doctor).filter(Doctor.status == "Active").all()
    
    # Filter by specialization if possible
    filtered_doctors = [
        d for d in doctors 
        if specialization.lower() in d.specialization.lower() or d.specialization.lower() in specialization.lower()
    ]
    if not filtered_doctors :
        filtered_doctors = doctors  # Fallback to all active doctors if no specialization match

    doc_list = []
    today = date.today()

    for doc in filtered_doctors :
        waiting_count = db.query(Visit).filter(
            Visit.did == doc.did,
            Visit.visit_date == today,
            Visit.status == "Waiting"
        ).count()

        est_wait = waiting_count * doc.avg_time
        doc_list.append({
            "did": doc.did,
            "name": doc.name,
            "specialization": doc.specialization,
            "avg_time": doc.avg_time,
            "queue_count": waiting_count,
            "estimated_wait_time": est_wait
        })

    # Sort by queue_count ascending
    doc_list.sort(key=lambda x: (x["queue_count"], x["estimated_wait_time"]))

    for idx, d in enumerate(doc_list) :
        d["is_recommended"] = (idx == 0)

    return doc_list


def register_opd_patient(data, db: Session) :
    today = date.today()
    now_time = datetime.now()

    # 1. Find or create patient
    contact_val = data.contact.strip() if data.contact else "0000000000"
    exist_pat = db.query(Patient).filter(Patient.contact == contact_val).first()
    
    if exist_pat :
        patient = exist_pat
    else :
        patient = Patient(
            name = data.name,
            dob = data.dob,
            age = data.age,
            gender = data.gender,
            email = data.email,
            contact = contact_val,
            address = data.address,
            create_at = now_time
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    # 2. Lookup symptom details
    symptom = db.query(Symptoms_master).filter(Symptoms_master.sid == data.sid).first()
    if not symptom :
        symptom = db.query(Symptoms_master).first()

    sid_val = symptom.sid if symptom else 1
    p_score = symptom.priority_score if symptom else 10
    p_level = symptom.priority if symptom else "Low"

    # 3. Lookup receptionist
    rec = db.query(Receptionist).filter(Receptionist.rid == data.rid).first()
    if not rec :
        rec = db.query(Receptionist).first()
    rid_val = rec.rid if rec else 1

    # 4. Determine assigned doctor
    assigned_doctor = None
    if data.did :
        assigned_doctor = db.query(Doctor).filter(Doctor.did == data.did).first()

    if not assigned_doctor :
        target_spec = symptom.specialization if (symptom and getattr(symptom, 'specialization', None)) else data.specialization
        avail_docs = get_doctors_with_queue(target_spec, db)
        if avail_docs :
            best_doc_id = avail_docs[0]["did"]
            assigned_doctor = db.query(Doctor).filter(Doctor.did == best_doc_id).first()


    if not assigned_doctor :
        assigned_doctor = db.query(Doctor).first()

    if not assigned_doctor :
        return {"message": "No doctor available in database"}

    # 5. Generate today's sequential token number
    today_visits_count = db.query(Visit).filter(Visit.visit_date == today).count()
    token_num = today_visits_count + 101

    # 6. Create Visit
    new_visit = Visit(
        pid = patient.pid,
        did = assigned_doctor.did,
        rid = rid_val,
        sid = sid_val,
        token = token_num,
        visit_date = today,
        status = "Waiting",
        create_at = now_time,
        update_at = now_time
    )
    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)

    # 7. Create Queue entry
    waiting_count = db.query(Visit).filter(
        Visit.did == assigned_doctor.did,
        Visit.visit_date == today,
        Visit.status == "Waiting"
    ).count()

    queue_pos = waiting_count
    est_wait = queue_pos * (assigned_doctor.avg_time or 10)

    new_queue = Queue(
        vid = new_visit.vid,
        queue_position = queue_pos,
        priority_score = p_score,
        waiting_bonus = 0,
        final_score = p_score,
        estimated_wait_time = est_wait,
        status = "Waiting",
        create_at = now_time,
        update_at = now_time
    )
    db.add(new_queue)
    db.commit()
    db.refresh(new_queue)

    return {
        "message": "OPD Registration Successful!",
        "token": token_num,
        "patient_id": patient.pid,
        "patient_name": patient.name,
        "doctor_id": assigned_doctor.did,
        "doctor_name": assigned_doctor.name,
        "specialization": assigned_doctor.specialization,
        "queue_position": queue_pos,
        "estimated_wait_time": est_wait,
        "priority": p_level,
        "priority_score": p_score
    }
