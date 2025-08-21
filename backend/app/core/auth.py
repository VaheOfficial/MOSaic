from datetime import datetime, timedelta, timezone
from typing import Optional
import hashlib
import hmac
import base64
import json
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.config import JWT_SECRET, JWT_ALG
from app.core.db import get_db
from app.models.base import User


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64url_decode(data: str) -> bytes:
    padding = '=' * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(sub: str, role: str, expires_minutes: int = 60 * 8) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = datetime.now(timezone.utc)
    payload = {"sub": sub, "role": role, "iat": int(now.timestamp()), "exp": int((now + timedelta(minutes=expires_minutes)).timestamp())}
    header_b64 = _b64url(json.dumps(header, separators=(",", ":")).encode())
    payload_b64 = _b64url(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{header_b64}.{payload_b64}".encode()
    signature = hmac.new(JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_token(token: str) -> dict:
    try:
        header_b64, payload_b64, sig_b64 = token.split(".")
        signing_input = f"{header_b64}.{payload_b64}".encode()
        expected = hmac.new(JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
        actual = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected, actual):
            raise ValueError("bad signature")
        payload = json.loads(_b64url_decode(payload_b64))
        if payload.get("exp") and int(payload["exp"]) < int(datetime.now(timezone.utc).timestamp()):
            raise ValueError("token expired")
        return payload
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme), db: Session = Depends(get_db)) -> User:
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")
    token = creds.credentials
    payload = decode_token(token)
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_roles(*roles: str):
    def _dep(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user
    return _dep


