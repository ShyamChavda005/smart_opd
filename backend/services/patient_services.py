from crud import patient_crud

def add_patinet(pat, db) :
    return patient_crud.add_patient(pat, db)

def get_patients(db) :
    return patient_crud.get_patients(db)

def get_one_patient(id, db) :
    return patient_crud.get_one_patient(id, db)

def update_patient(id, pat, db) :
    return patient_crud.update_patient(id, pat, db) 

def delete_patient(id, db) :
    return patient_crud.delete_patient(id, db)