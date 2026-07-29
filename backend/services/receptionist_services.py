from crud import receptionist_crud

def validate_receptionist(rec, db) :
    return receptionist_crud.validate_receptionist(rec, db)

def add_receptionist(rec, db) :
    return receptionist_crud.add_receptionist(rec, db)

def get_receptionist(db) :
    return receptionist_crud.get_receptionist(db)

def get_one_receptionist(id, db) :
    return receptionist_crud.get_one_receptionist(id, db)

def update_receptionist(id, rec, db) :
    return receptionist_crud.update_receptionist(id, rec, db)

def delete_receptionist(id, db) :
    return receptionist_crud.delete_receptionist(id, db)