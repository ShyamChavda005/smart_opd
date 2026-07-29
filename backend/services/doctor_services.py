from crud import doctor_crud

def validate_doctor(doc, db) :
    return doctor_crud.validate_doctor(doc, db)

def add_doctor(doc, db) :
    return doctor_crud.add_doctor(doc, db)

def get_doctors(db) :
    return doctor_crud.get_doctors(db)

def get_one_doctor(id, db) :
    return doctor_crud.get_one_doctor(id, db)

def update_doctor(id, doc, db) :
    return doctor_crud.update_doctor(id, doc, db)

def delete_doctor(id, db) :
    return doctor_crud.delete_doctor(id, db)