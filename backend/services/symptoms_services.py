from crud import symptoms_crud

def get_symptoms(db) :
    return symptoms_crud.get_symptoms(db)

def add_symptoms(sym, db) :
    return symptoms_crud.add_symptoms(sym, db)

def update_symptoms(id, sym, db) :
    return symptoms_crud.update_symptoms(id, sym, db)

def update_symptoms_status(id, status, db) :
    return symptoms_crud.update_status(id, status, db)

def delete_symtoms(id, db) :
    return symptoms_crud.delete_symptoms(id, db)