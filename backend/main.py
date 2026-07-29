from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin, doctor, receptionist, patient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# admin route
app.include_router(admin.router)

# doctor route
app.include_router(doctor.router)

# receptionist route
app.include_router(receptionist.router)

#patient route
app.include_router(patient.router)