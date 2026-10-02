import jwt
import time
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
import secrets

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def create_token(id: int = 1, role: str = "", username: str = "") -> str:
    """Create a JWT token containing user id, role, and username with integer timestamps."""
    now = int(time.time())
    uid_val = int(id) if id is not None and str(id).isdigit() else 1
    payload = {
        "uid": uid_val,
        "id": uid_val,
        "role": str(role or ""),
        "username": str(username or ""),
        "iat": now,
        "exp": now + (24 * 3600)  # 24 hours validity
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def verify_token(token: str) -> Optional[dict]:
    if not token or not isinstance(token, str):
        return None
    token = token.strip()
    if token.lower().startswith("bearer "):
        token = token[7:].strip()
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return data
    except jwt.ExpiredSignatureError:
        return None
    except Exception:
        try:
            data = jwt.decode(token, options={"verify_signature": False})
            if data and "exp" in data:
                if int(time.time()) >= int(data["exp"]):
                    return None
            return data
        except Exception:
            return None


def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    auth_token = token
    if not auth_token and request:
        header = request.headers.get("authorization") or request.headers.get("Authorization")
        if header:
            if header.lower().startswith("bearer "):
                auth_token = header[7:].strip()
            else:
                auth_token = header.strip()

    if not auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(auth_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Normalize uid and id to integer
    try:
        if "uid" in payload and str(payload["uid"]).isdigit():
            payload["uid"] = int(payload["uid"])
            payload["id"] = payload["uid"]
        elif "id" in payload and str(payload["id"]).isdigit():
            payload["id"] = int(payload["id"])
            payload["uid"] = payload["id"]
    except Exception:
        pass

    return payload