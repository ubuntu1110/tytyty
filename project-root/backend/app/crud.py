from typing import Optional
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models import User, Expense, Chat
from app.schemas import UserCreate, UserUpdate, ExpenseCreate, ChatCreate, AnalyticsRequest
from datetime import date, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_pw = pwd_context.hash(user.password)
    role = user.role
    if user.is_admin:
        role = "admin"
    db_user = User(username=user.username, hashed_password=hashed_pw, is_admin=user.is_admin, role=role, city=user.city)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, data: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    if data.username:
        db_user.username = data.username
    if data.password:
        db_user.hashed_password = pwd_context.hash(data.password)
    if data.role:
        db_user.role = data.role
        db_user.is_admin = (data.role == "admin")
    if data.city is not None:
        db_user.city = data.city
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_expense(db: Session, expense: ExpenseCreate, owner_id: int):
    db_expense = Expense(**expense.dict(), owner_id=owner_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_user_expenses(db: Session, owner_id: int, city: Optional[str] = None, category: Optional[str] = None):
    q = db.query(Expense).filter(Expense.owner_id == owner_id)
    if city:
        q = q.join(User).filter(User.city == city)
    if category:
        q = q.filter(Expense.category == category)
    return q.all()

def get_all_expenses(db: Session, city: Optional[str] = None, category: Optional[str] = None):
    q = db.query(Expense)
    if city:
        q = q.join(User).filter(User.city == city)
    if category:
        q = q.filter(Expense.category == category)
    return q.all()

def create_chat(db: Session, chat: ChatCreate, owner_id: int):
    db_chat = Chat(**chat.dict(), owner_id=owner_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_all_chats(db: Session, city: Optional[str] = None):
    q = db.query(Chat)
    if city:
        q = q.join(User).filter(User.city == city)
    return q.all()

def calculate_analytics(db: Session, req: AnalyticsRequest):
    expenses = get_all_expenses(db, city=req.city, category=req.category)
    chats = get_all_chats(db, city=req.city)

    end_date = date.today()
    if req.period == "day":
        start_date = end_date
    elif req.period == "week":
        start_date = end_date - timedelta(days=7)
    else:
        start_date = end_date - timedelta(days=30)

    filtered_expenses = [e for e in expenses if e.date >= start_date and e.date <= end_date]
    filtered_chats = [c for c in chats if c.purchase_date and c.purchase_date >= start_date and c.purchase_date <= end_date]

    total_amount = sum(e.amount for e in filtered_expenses)
    total_chats = len(filtered_chats)
    total_expenses = len(filtered_expenses)

    return {"total_amount": total_amount, "total_chats": total_chats, "total_expenses": total_expenses}

def delete_user(db: Session, user_id: int):
    usr = db.query(User).filter(User.id == user_id).first()
    if usr:
        db.delete(usr)
        db.commit()
    return usr

def create_holiday(db: Session, name: str, holiday_date: date):
    from app.models import Holiday
    h = Holiday(name=name, date=holiday_date)
    db.add(h)
    db.commit()
    db.refresh(h)
    return h

def get_upcoming_holidays(db: Session):
    from app.models import Holiday
    today = date.today()
    # Получим праздники, которые еще не прошли
    return db.query(Holiday).filter(Holiday.date >= today).order_by(Holiday.date).all()
