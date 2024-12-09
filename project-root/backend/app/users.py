from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserRead, UserUpdate
from app.crud import create_user, get_user_by_username, update_user, delete_user
from app.auth import get_current_admin_user

router = APIRouter()

@router.post("/create_user", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    existing = get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user(db, user)

@router.get("/all_users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    from app.models import User
    return db.query(User).all()

@router.put("/update_user/{user_id}", response_model=UserRead)
def update_user_endpoint(user_id: int, data: UserUpdate, db: Session=Depends(get_db), admin=Depends(get_current_admin_user)):
    usr = update_user(db, user_id, data)
    if not usr:
        raise HTTPException(404, "User not found")
    return usr

@router.delete("/delete_user/{user_id}")
def remove_user(user_id: int, db: Session=Depends(get_db), admin=Depends(get_current_admin_user)):
    usr = delete_user(db, user_id)
    if not usr:
        raise HTTPException(404, detail="User not found")
    return {"detail": "User deleted"}
