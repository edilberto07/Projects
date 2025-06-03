from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Payroll System API",
    description="API for Payroll Management System with Chatbot Integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database
from database.database import SessionLocal, engine
from models import models

models.Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: str
    is_active: Optional[bool] = True

class UserInDB(User):
    hashed_password: str

class ChatMessage(BaseModel):
    content: str
    sender: str
    timestamp: datetime

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

# Chatbot routes
@app.post("/api/chatbot/message", response_model=ChatMessage)
async def send_message(
    message: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement actual chatbot logic here
    response = {
        "content": f"I received your message: {message}. This is a placeholder response.",
        "sender": "bot",
        "timestamp": datetime.utcnow()
    }
    
    # Save message to database
    db_message = models.ChatMessage(
        user_id=current_user.id,
        content=message,
        sender="user",
        timestamp=datetime.utcnow()
    )
    db.add(db_message)
    
    db_response = models.ChatMessage(
        user_id=current_user.id,
        content=response["content"],
        sender="bot",
        timestamp=datetime.utcnow()
    )
    db.add(db_response)
    db.commit()
    
    return response

@app.get("/api/chatbot/history", response_model=List[ChatMessage])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(models.ChatMessage)\
        .filter(models.ChatMessage.user_id == current_user.id)\
        .order_by(models.ChatMessage.timestamp)\
        .all()
    return messages

@app.delete("/api/chatbot/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(models.ChatMessage)\
        .filter(models.ChatMessage.user_id == current_user.id)\
        .delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 