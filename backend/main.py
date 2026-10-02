from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin, doctor, receptionist, patient, symptoms, visit, queue, opd, reports

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
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

#symptoms route
app.include_router(symptoms.router)

#visit route
app.include_router(visit.router)

#queue route
app.include_router(queue.router)

#opd route
app.include_router(opd.router)

# admin report route
app.include_router(reports.router)

