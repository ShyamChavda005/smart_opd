from pydantic import BaseModel, Field
from datetime import date

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
    
    