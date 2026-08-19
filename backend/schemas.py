from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class AdminValidate(BaseModel) :
    name : str
    email : str
    username : str
    password : str
    
    
class AdminLoginValidate(BaseModel) :
    username : str
    password : str


class DoctorValidate(BaseModel) :
    name : str
    dob : date 
    gender : str
    email : str
    contact : str = Field(min_length=10)
    specialization : str
    avg_time : int = Field(gt=0)
    username : str
    password : str
    status : str


class DoctorLoginValidate(BaseModel) :
    username : str
    password : str
    

class ReceptionistValidate(BaseModel) :
    name : str
    dob : date
    gender : str
    email : str
    contact : str
    username : str
    password : str
    shift : str
    status : str
    
    
class ReceptionistLoginValidate(BaseModel) :
    username : str
    password : str


class PatientValidate(BaseModel) :
    name : str
    dob : date
    age : int
    gender : str
    email : str
    contact : str
    address : str


class Symptoms_masterValidate(BaseModel) :
    symptom_name : str
    priority : str
    priority_score : int
    specialization : str
    is_active : str

    
class VisitValidate(BaseModel) :
    pid : int
    did : int
    rid : int
    sid : int
    token : int
    visit_date : date
    status : str


class QueueValidate(BaseModel) :
    vid : int
    queue_position : int
    priority_score : int
    waiting_bonus : int
    final_score : int
    estimated_wait_time : int
    status : str


class OPDRegisterValidate(BaseModel) :
    name : str
    dob : date
    age : int
    gender : str
    email : str
    contact : str
    address : str
    specialization : str
    sid : int
    rid : int = 1
    did : Optional[int] = None


