import os
import re
import time
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

ENV_PATH = Path(__file__).resolve().parent / ".env"


def _get_brevo_config():
    load_dotenv(dotenv_path=ENV_PATH, override=True)
    return (
        os.getenv("BREVO_API_KEY", "").strip(),
        os.getenv("BREVO_SENDER_EMAIL", "").strip(),
        os.getenv("BREVO_SENDER_NAME", "MediQ").strip() or "MediQ",
    )


def send_credentials_email(to_email: str, name: str, role: str, username: str, password: str):
    try:
        brevo_api_key, sender_email, sender_name = _get_brevo_config()
        recipient = (to_email or "").strip()
        if (
            not recipient
            or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", recipient)
            or not brevo_api_key
            or not sender_email
        ):
            print(
                "CREDENTIAL EMAIL ERROR: invalid recipient or missing Brevo "
                "configuration (check backend/.env)"
            )
            return False

        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": brevo_api_key,
            "content-type": "application/json"
        }

        data = {
            "sender": {
                "name": sender_name,
                "email": sender_email
            },
            "to": [
                {
                    "email": recipient,
                    "name": (name or "").strip()
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
{sender_name}
"""
        }

        for attempt in range(2):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=data,
                    timeout=15,
                )
                if response.ok:
                    try:
                        message_id = response.json().get("messageId")
                    except ValueError:
                        message_id = None
                    print("Credential email sent:", message_id or "accepted by Brevo")
                    return True

                print(
                    "CREDENTIAL EMAIL ERROR: Brevo rejected the request "
                    f"(HTTP {response.status_code}): {response.text}"
                )
                if response.status_code < 500:
                    return False
            except requests.RequestException as error:
                print(f"CREDENTIAL EMAIL ATTEMPT {attempt + 1} FAILED:", repr(error))
                if attempt == 1:
                    return False
            if attempt == 0:
                time.sleep(1)

        return False

    except Exception as e:
        print("CREDENTIAL EMAIL ERROR:", repr(e))
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
        brevo_api_key, sender_email, sender_name = _get_brevo_config()
        recipient = (to_email or "").strip()
        if not recipient or not brevo_api_key or not sender_email:
            print(
                "TOKEN EMAIL ERROR: recipient or Brevo configuration is missing "
                "(check backend/.env)"
            )
            return False

        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            json={
                "sender": {
                    "name": sender_name,
                    "email": sender_email,
                },
                "to": [{"email": recipient, "name": patient_name}],
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
{sender_name}
""",
            },
            headers={
                "accept": "application/json",
                "api-key": brevo_api_key,
                "content-type": "application/json",
            },
            timeout=15,
        )
        response.raise_for_status()
        print("Token email sent:", response.json().get("messageId"))
        return True
    except Exception as e:
        print("TOKEN EMAIL ERROR:", repr(e))
        return False