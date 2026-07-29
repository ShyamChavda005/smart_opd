from models import Admin
from database import Base, engine

Base.metadata.create_all(engine)

def fetch_admin(db) :
    return db.query(Admin).all()


def update_admin(id, newData, db) :
    exits_admin = db.query(Admin).filter(Admin.id == id).first()
    
    if exits_admin is None :
        return {"messages" : "No Admin with this id"}
    
    exits_admin.name = newData.name
    exits_admin.email = newData.email
    exits_admin.username = newData.username
    exits_admin.password = newData.password
    
    db.commit()
    db.refresh(exits_admin)
    
    return exits_admin


def validate_admin(ad, db) :
    return db.query(Admin).filter(Admin.username == ad.username, 
                                  Admin.password == ad.password).first()