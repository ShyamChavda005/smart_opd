from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import date

from database import get_db
from models import Visit, Queue, Doctor, Symptoms_master


router = APIRouter(
    prefix="/admin",
    tags=["Admin Reports"]
)


@router.get("/reports")
def get_admin_reports(
    range: str = Query("Today"),
    db: Session = Depends(get_db)
):

    # =========================================================
    # DATE RANGE
    # =========================================================

    today = date.today()

    if range == "Today":

        start_date = today

    elif range == "This Week":

        start_date = today.fromordinal(
            today.toordinal() - today.weekday()
        )

    elif range == "This Month":

        start_date = today.replace(day=1)

    elif range == "This Quarter":

        quarter_month = ((today.month - 1) // 3) * 3 + 1

        start_date = today.replace(
            month=quarter_month,
            day=1
        )

    else:

        start_date = today


    # =========================================================
    # BASE VISIT QUERY
    # =========================================================

    base_query = (
        db.query(Visit)
        .filter(
            Visit.visit_date >= start_date,
            Visit.visit_date <= today
        )
    )


    # =========================================================
    # TOTAL OPD PATIENTS
    # =========================================================

    total_patients = (
        base_query
        .with_entities(
            func.count(Visit.vid)
        )
        .scalar()
    ) or 0


    # =========================================================
    # COMPLETED CONSULTATIONS
    # =========================================================

    completed_consultations = (
        base_query
        .filter(
            Visit.status == "Completed"
        )
        .with_entities(
            func.count(Visit.vid)
        )
        .scalar()
    ) or 0


    # =========================================================
    # EMERGENCY PATIENTS
    # =========================================================

    emergency_admissions = (
        db.query(
            func.count(Visit.vid)
        )
        .join(
            Symptoms_master,
            Symptoms_master.sid == Visit.sid
        )
        .filter(
            Visit.visit_date >= start_date,
            Visit.visit_date <= today,
            Symptoms_master.priority == "Emergency"
        )
        .scalar()
    ) or 0


    # =========================================================
    # AVERAGE WAIT TIME
    # =========================================================

    avg_wait_time = (
        db.query(
            func.avg(Queue.estimated_wait_time)
        )
        .join(
            Visit,
            Visit.vid == Queue.vid
        )
        .filter(
            Visit.visit_date >= start_date,
            Visit.visit_date <= today
        )
        .scalar()
    )

    avg_wait_time = (
        round(float(avg_wait_time), 1)
        if avg_wait_time is not None
        else 0
    )


    # =========================================================
    # DEPARTMENT REPORT
    #
    # Department = Doctor.specialization
    # =========================================================

    department_rows = (
        db.query(

            Doctor.specialization.label(
                "department"
            ),

            func.count(
                Visit.vid
            ).label(
                "total_patients"
            ),

            func.avg(
                Queue.estimated_wait_time
            ).label(
                "avg_wait_time"
            ),

            # IMPORTANT:
            # case() instead of func.case()

            func.sum(
                case(
                    (
                        Visit.status == "Completed",
                        1
                    ),
                    else_=0
                )
            ).label(
                "completed_consultations"
            ),

            func.sum(
                case(
                    (
                        Symptoms_master.priority == "Emergency",
                        1
                    ),
                    else_=0
                )
            ).label(
                "emergency_patients"
            )
        )

        # Doctor -> Visit
        .join(
            Visit,
            Visit.did == Doctor.did
        )

        # Visit -> Queue
        .outerjoin(
            Queue,
            Queue.vid == Visit.vid
        )

        # Visit -> Symptoms
        .join(
            Symptoms_master,
            Symptoms_master.sid == Visit.sid
        )

        # Date filter
        .filter(
            Visit.visit_date >= start_date,
            Visit.visit_date <= today
        )

        # Group by specialization
        .group_by(
            Doctor.specialization
        )

        # Highest patient count first
        .order_by(
            func.count(Visit.vid).desc()
        )

        .all()
    )


    # =========================================================
    # FORMAT DEPARTMENT DATA
    # =========================================================

    departments = []

    for row in department_rows:

        department_wait = (
            round(
                float(row.avg_wait_time),
                1
            )
            if row.avg_wait_time is not None
            else 0
        )

        departments.append({

            "department": (
                row.department
                if row.department
                else "Unknown"
            ),

            "total_patients": int(
                row.total_patients or 0
            ),

            "avg_wait_time": department_wait,

            "completed_consultations": int(
                row.completed_consultations or 0
            ),

            "emergency_patients": int(
                row.emergency_patients or 0
            )
        })


    # =========================================================
    # FINAL RESPONSE
    # =========================================================

    return {

        "range": range,

        "summary": {

            "total_patients": int(
                total_patients
            ),

            "avg_wait_time": avg_wait_time,

            "completed_consultations": int(
                completed_consultations
            ),

            "emergency_admissions": int(
                emergency_admissions
            )
        },

        "departments": departments
    }
