
from sqlalchemy import Column, Integer, String, TIMESTAMP, Date
from database import Base

class Admin(Base) :
    __tablename__ = "admin"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255))
    username = Column(String(50), index=True)
    password = Column(String(255))
    create_at = Column(TIMESTAMP)
    
    
class Doctor(Base) :
    __tablename__ = "doctors"
    
    did = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    dob = Column(Date())
    gender = Column(String(10))
    email = Column(String(100))
    contact = Column(String(15), unique=True)
    specialization = Column(String(100))
    avg_time = Column(Integer)
    username = Column(String(255), index=True)
    password = Column(String(255))
    status = Column(String(10), default="Active")
    create_at = Column(TIMESTAMP)


class Receptionist(Base) :
    __tablename__ = "receptionist"
    
    rid = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date)
    gender = Column(String(10), nullable=False)
    email = Column(String(100), nullable=False)
    contact = Column(String(15), nullable=False, unique=True)
    username = Column(String(100), index=True, nullable=False)
    password = Column(String(255), nullable=False)
    shift = Column(String(10), nullable=False)
    status = Column(String(10), default="Active", nullable=False)
    create_at = Column(TIMESTAMP, nullable=False)
    
    
class Patient(Base) :
    __tablename__ = "patient"
    
    pid = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date)
    age = Column(Integer, default=0, nullable=False)
    gender = Column(String(10), nullable=False)
    email = Column(String(100), nullable=False)
    contact = Column(String(15), nullable=False, unique=True)
    address = Column(String(100), nullable=True)
    create_at = Column(TIMESTAMP, nullable=False)
    

# class Symptom(Base) :
#     __tablename__ = "symptom"
    
# id         ---> 1
# symptom_name ---> cold, fever
# priority ----> low, medium, emergency
# priority_score -----> [40,60,80,100]
# estimated_time ----->  [5,8,12,20]


# __tablename__ = "opd_visit"

# visit_id
# patient_id
# doctor_id
# token_no
# symptom_id
# priority
# priority_score
# waiting_bonus
# final_score
# estimated_wait_time
# queue_position
# status
# arrival_time
# consultation_start
# consultation_end
# created_at
    
    
    
    
    
    