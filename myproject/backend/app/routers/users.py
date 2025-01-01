# backend/app/routers/users.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, UserOut, UserUpdate, CityUpdate
from app.utils import get_password_hash, is_admin, get_current_user
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    users = db.query(User).all()
    return users

@router.get("/roles", response_model=List[str])
def get_roles(current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    return ["admin", "accountant", "moderator"]

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username=user.username,
        hashed_password=get_password_hash(user.password),
        role=user.role,
        active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    existing_user = db.query(User).filter(User.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        if db.query(User).filter(User.username == user_update.username, User.id != user_id).first():
            raise HTTPException(status_code=400, detail="Username already exists")
        existing_user.username = user_update.username
    if user_update.password:
        existing_user.hashed_password = get_password_hash(user_update.password)
    if user_update.role:
        if user_update.role not in ['admin', 'accountant', 'moderator']:
            raise HTTPException(status_code=400, detail="Invalid role")
        existing_user.role = user_update.role
    if user_update.accountant_city is not None:
        existing_user.accountant_city = user_update.accountant_city

    db.commit()
    db.refresh(existing_user)
    return existing_user

@router.delete("/{user_id}", response_model=UserOut)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user

@router.put("/accountant/city", response_model=UserOut)
def update_accountant_city(city_update: CityUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != 'accountant':
        raise HTTPException(status_code=403, detail="Доступ запрещён")

    if not city_update.accountant_city.strip():
        raise HTTPException(status_code=400, detail="Город не может быть пустым")

    existing_user = db.query(User).filter(User.id == current_user.id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    existing_user.accountant_city = city_update.accountant_city.strip()
    db.commit()
    db.refresh(existing_user)
    return existing_user
