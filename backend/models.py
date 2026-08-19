
from sqlalchemy import Column, Integer, String, TIMESTAMP, Date, ForeignKey
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
    

class Symptoms_master(Base) :
    __tablename__ = "symptoms_master"
    
    sid = Column(Integer, primary_key=True, index=True)
    symptom_name = Column(String(100), nullable=False)
    priority = Column(String(10), nullable=False, unique=True)
    priority_score = Column(Integer, nullable=False)
    specialization = Column(String(100), nullable=False)
    is_active = Column(String(10), nullable=False)
    update_at = Column(TIMESTAMP, nullable=False)
    create_at = Column(TIMESTAMP, nullable=False)
    
    
    
class Visit(Base) :

    __tablename__ = "visit"

    vid = Column(Integer, primary_key=True, index=True)
    pid = Column(Integer, ForeignKey("patient.pid"), nullable=False)
    did = Column(Integer, ForeignKey("doctors.did"), nullable=False)
    rid = Column(Integer, ForeignKey("receptionist.rid"), nullable=False)
    sid = Column(Integer, ForeignKey("symptoms_master.sid"), nullable=False)
    token = Column(Integer, nullable=False)
    visit_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)
    create_at = Column(TIMESTAMP, nullable=False)
    update_at = Column(TIMESTAMP)
    
    
    
class Queue(Base) : 
    
    __tablename__ = "queue"
    
    qid = Column(Integer, primary_key=True, index=True)
    vid = Column(Integer, ForeignKey("visit.vid"), nullable=False)
    queue_position = Column(Integer, nullable=False)
    priority_score = Column(Integer, nullable=False)
    waiting_bonus = Column(Integer, nullable=False)
    final_score = Column(Integer, nullable=False)
    estimated_wait_time = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    create_at = Column(TIMESTAMP)
    update_at = Column(TIMESTAMP)

    
    
    
    
    