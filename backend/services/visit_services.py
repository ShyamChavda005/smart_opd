from crud import visit_crud

def add_visit(vis, db) :
    return visit_crud.add_visit(vis, db)

def get_visits(db) :
    return visit_crud.get_visits(db)

def get_one_visit(id, db) :
    return visit_crud.get_one_visit(id, db)

def update_visit(id, vis, db) :
    return visit_crud.update_visit(id, vis, db)

def update_visit_symptom(id, sid, db) :
    return visit_crud.update_visit_symptom(id, sid, db)


def delete_visit(id, db) :
    return visit_crud.delete_visit(id, db)
