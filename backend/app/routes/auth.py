from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.db import get_db
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/signup")
async def signup(user: UserCreate, db = Depends(get_db)):
    # In a real app, check if user exists and save to MongoDB
    # For now, placeholder
    hashed_password = get_password_hash(user.password)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    # Placeholder auth
    if form_data.username == "admin" and form_data.password == "admin":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
