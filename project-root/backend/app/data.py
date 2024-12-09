from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ExpenseCreate, ExpenseRead, ChatCreate, ChatRead, AnalyticsRequest, AnalyticsResponse, HolidayRead
from app.crud import create_expense, get_user_expenses, get_all_expenses, create_chat, get_all_chats, calculate_analytics, get_upcoming_holidays
from app.auth import get_current_user, get_current_admin_user, get_current_moderator_user
from typing import Optional
from datetime import date

router = APIRouter()

@router.get("/holidays", response_model=list[HolidayRead])
def list_holidays(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Все зарегистрированные пользователи могут видеть праздники
    return get_upcoming_holidays(db)

@router.post("/expenses", response_model=ExpenseRead)
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_expense(db, expense, user.id)

@router.get("/my_expenses", response_model=list[ExpenseRead])
def my_expenses(
        db: Session=Depends(get_db),
        user=Depends(get_current_user),
        city: Optional[str] = Query(None),
        category: Optional[str] = Query(None)
):
    return get_user_expenses(db, user.id, city=city, category=category)

@router.get("/all_expenses", response_model=list[ExpenseRead])
def all_expenses(
        db: Session=Depends(get_db),
        admin=Depends(get_current_admin_user),
        city: Optional[str] = Query(None),
        category: Optional[str] = Query(None)
):
    return get_all_expenses(db, city=city, category=category)

@router.post("/chats", response_model=ChatRead)
def add_chat(chat: ChatCreate, db: Session=Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["accountant", "moderator", "admin"]:
        raise HTTPException(403, "Not allowed")
    return create_chat(db, chat, user.id)

@router.get("/all_chats", response_model=list[ChatRead])
def list_chats(
        db: Session=Depends(get_db),
        user=Depends(get_current_moderator_user),
        city: Optional[str] = Query(None)
):
    return get_all_chats(db, city=city)

@router.post("/analytics", response_model=AnalyticsResponse)
def get_analytics(req: AnalyticsRequest, db: Session=Depends(get_db), admin=Depends(get_current_admin_user)):
    return AnalyticsResponse(**calculate_analytics(db, req))
