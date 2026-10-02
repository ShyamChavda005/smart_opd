import os
import requests
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME")


def send_credentials_email(to_email: str, name: str, role: str, username: str, password: str):
    try:
        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        data = {
            "sender": {
                "name": BREVO_SENDER_NAME,
                "email": BREVO_SENDER_EMAIL
            },
            "to": [
                {
                    "email": to_email,
                    "name": name
                }
            ],
            "subject": "MediQ Account Credentials",
            "textContent": f"""
Hello {name},

Welcome to MediQ.

Your {role} account has been successfully created by the MediQ administrator. You can use the following credentials to access the system:

Account Details

Role: {role}
Username: {username}
Temporary Password: {password}

Please use these credentials to log in to the MediQ system. For security purposes, we strongly recommend changing your password after your first login.

If you have any issues while accessing your account, please contact the system administrator.

Regards,
{BREVO_SENDER_NAME}
"""
        }

        response = requests.post(
            url,
            headers=headers,
            json=data,
            timeout=15
        )

        print("Brevo HTTP status:", response.status_code)
        print("Brevo response:", response.text)

        response.raise_for_status()

        result = response.json()

        print("Brevo message ID:", result.get("messageId"))

        return True

    except Exception as e:
        print("EMAIL ERROR:", repr(e))
        return False


def send_token_email(
    to_email: str,
    patient_name: str,
    token: int,
    doctor_name: str,
    specialization: str,
    queue_position: int,
    estimated_wait_time: int,
    priority: str,
):
    try:
        if not to_email or not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
            print("TOKEN EMAIL ERROR: email configuration or recipient is missing")
            return False

        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json",
            },
            json={
                "sender": {
                    "name": BREVO_SENDER_NAME or "MediQ",
                    "email": BREVO_SENDER_EMAIL,
                },
                "to": [{"email": to_email, "name": patient_name}],
                "subject": f"MediQ OPD Token #{token}",
                "textContent": f"""Hello {patient_name},

Your MediQ OPD registration is confirmed.

Token: #{token}
Doctor: {doctor_name}
Department: {specialization}
Queue position: #{queue_position}
Estimated waiting time: {estimated_wait_time} minutes
Priority: {priority}

Please keep this email for your visit.

Regards,
{BREVO_SENDER_NAME or "MediQ"}
""",
            },
            timeout=15,
        )
        response.raise_for_status()
        print("Token email sent:", response.json().get("messageId"))
        return True
    except Exception as e:
        print("TOKEN EMAIL ERROR:", repr(e))
        return False