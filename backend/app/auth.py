from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models import TokenData
import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def _pre_hash_password(password: str) -> bytes:
    """Pre-hash password with SHA-256 to handle bcrypt's 72-byte limit."""
    return hashlib.sha256(password.encode('utf-8')).digest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash.
    Supports both new (pre-hashed) and old (direct) password hashes for backward compatibility.
    """
    # Ensure hashed_password is bytes
    if isinstance(hashed_password, str):
        hashed_password_bytes = hashed_password.encode('utf-8')
    else:
        hashed_password_bytes = hashed_password
    
    # Try new method first (with SHA-256 pre-hashing)
    pre_hashed = _pre_hash_password(plain_password)
    if bcrypt.checkpw(pre_hashed, hashed_password_bytes):
        return True
    
    # Fallback to old method (direct password) for backward compatibility
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password_bytes)
    except ValueError:
        # Password too long for old method, but new method already failed
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt with SHA-256 pre-hashing."""
    pre_hashed = _pre_hash_password(password)
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pre_hashed, salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    return token_data

