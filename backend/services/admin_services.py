from crud import admin_crud

def get_admin(db) :
    return admin_crud.fetch_admin(db)

def update_admin(id, newData, db) :
    return admin_crud.update_admin(id, newData ,db)

def validate_admin(ad, db) :
    return admin_crud.validate_admin(ad, db)