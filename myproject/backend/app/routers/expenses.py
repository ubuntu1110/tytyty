# backend/app/routers/expenses.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database import get_db
from app.models import User, Expense
from app.schemas import ExpenseCreate, ExpenseOut, ExpenseAnalytics, ExpenseUpdate
from app.utils import is_accountant, is_admin, get_current_user
from datetime import timedelta

router = APIRouter()

def calculate_analytics(expenses: List[Expense]) -> ExpenseAnalytics:
    # Этот код остался прежним, не изменяем его, только для демонстрации
    rub_expenses = [e for e in expenses if e.currency == "RUB"]
    usd_expenses = [e for e in expenses if e.currency == "USD"]

    total_spent_rub = sum(e.amount for e in rub_expenses) if rub_expenses else 0
    total_count_rub = sum((e.quantity or 0) for e in rub_expenses) if rub_expenses else 0
    category_data_rub = {}
    for e in rub_expenses:
        c = e.category
        if c not in category_data_rub:
            category_data_rub[c] = {"spent": 0.0, "count": 0.0}
        category_data_rub[c]["spent"] += e.amount
        if e.quantity:
            category_data_rub[c]["count"] += e.quantity
    for c in category_data_rub:
        cat = category_data_rub[c]
        cat["avg_per_item"] = cat["spent"] / cat["count"] if cat["count"] > 0 else 0.0

    total_spent_usd = sum(e.amount for e in usd_expenses) if usd_expenses else 0
    total_count_usd = sum((e.quantity or 0) for e in usd_expenses) if usd_expenses else 0
    category_data_usd = {}
    for e in usd_expenses:
        c = e.category
        if c not in category_data_usd:
            category_data_usd[c] = {"spent": 0.0, "count": 0.0}
        category_data_usd[c]["spent"] += e.amount
        if e.quantity:
            category_data_usd[c]["count"] += e.quantity
    for c in category_data_usd:
        cat = category_data_usd[c]
        cat["avg_per_item"] = cat["spent"] / cat["count"] if cat["count"] > 0 else 0.0

    now = datetime.utcnow()
    one_week_ago = now - timedelta(days=7)
    prev_week_start = one_week_ago - timedelta(days=7)
    current_week_expenses = [e for e in expenses if e.created_at >= one_week_ago]
    prev_week_expenses = [e for e in expenses if prev_week_start <= e.created_at < one_week_ago]

    current_week_spent = sum(e.amount for e in current_week_expenses)
    prev_week_spent = sum(e.amount for e in prev_week_expenses)
    if current_week_spent > prev_week_spent:
        weekly_comparison = "больше, чем на прошлой неделе"
    elif current_week_spent < prev_week_spent:
        weekly_comparison = "меньше, чем на прошлой неделе"
    else:
        weekly_comparison = "на том же уровне"

    today = now.date()
    current_month_start = today.replace(day=1)
    if today.month == 1:
        prev_month_year = today.year - 1
        prev_month = 12
    else:
        prev_month_year = today.year
        prev_month = today.month - 1
    previous_month_start = date(prev_month_year, prev_month, 1)
    previous_month_end = current_month_start - timedelta(days=1)

    current_month_expenses = [e for e in expenses if e.created_at.date() >= current_month_start]
    prev_month_expenses = [e for e in expenses if previous_month_start <= e.created_at.date() <= previous_month_end]

    current_month_spent = sum(e.amount for e in current_month_expenses)
    prev_month_spent = sum(e.amount for e in prev_month_expenses)
    if current_month_spent > prev_month_spent:
        monthly_comparison = "больше, чем в прошлом месяце"
    elif current_month_spent < prev_month_spent:
        monthly_comparison = "меньше, чем в прошлом месяце"
    else:
        monthly_comparison = "на том же уровне, что и в прошлом месяце"

    return ExpenseAnalytics(
        total_spent_rub=total_spent_rub,
        total_count_rub=total_count_rub,
        category_data_rub=category_data_rub,
        total_spent_usd=total_spent_usd,
        total_count_usd=total_count_usd,
        category_data_usd=category_data_usd,
        weekly_comparison=weekly_comparison,
        monthly_comparison=monthly_comparison
    )

def apply_filters(query, accountant_id: Optional[int], start_date: Optional[str], end_date: Optional[str], category: Optional[str], currency: Optional[str]):
    # Применение фильтров к запросу
    if accountant_id is not None:
        query = query.filter(Expense.user_id == accountant_id)
    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Expense.created_at >= sd)
        except ValueError:
            pass  # Неверный формат даты, можно вернуть ошибку или просто игнорировать
    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1) - timedelta(seconds=1)
            # end_date включительно
            query = query.filter(Expense.created_at <= ed)
        except ValueError:
            pass
    if category:
        query = query.filter(Expense.category == category)
    if currency:
        query = query.filter(Expense.currency == currency)
    return query

@router.post("/", response_model=ExpenseOut)
def create_expense(
        expense: ExpenseCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # По умолчанию создание расхода доступно бухгалтеру
    from app.utils import is_accountant
    is_accountant(current_user)
    new_expense = Expense(
        user_id=current_user.id,
        category=expense.category,
        amount=expense.amount,
        quantity=expense.quantity if expense.quantity is not None else None,
        currency=expense.currency,
        goal=expense.goal
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(
        expense_id: int,
        expense_update: ExpenseUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Проверка роли пользователя (бухгалтер)
    from app.utils import is_accountant
    is_accountant(current_user)
    exp = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == current_user.id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found or not yours")
    if expense_update.category is not None:
        exp.category = expense_update.category
    if expense_update.amount is not None:
        exp.amount = expense_update.amount
    if expense_update.quantity is not None:
        exp.quantity = expense_update.quantity
    if expense_update.currency is not None:
        exp.currency = expense_update.currency
    if expense_update.goal is not None:
        exp.goal = expense_update.goal
    db.commit()
    db.refresh(exp)
    return exp

@router.get("/accountant", response_model=List[ExpenseOut])
def get_accountant_expenses(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    from app.utils import is_accountant
    is_accountant(current_user)
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
    return expenses

@router.get("/admin", response_model=List[ExpenseOut])
def get_admin_expenses(
        accountant_id: Optional[int] = Query(None),
        start_date: Optional[str] = Query(None),
        end_date: Optional[str] = Query(None),
        category: Optional[str] = Query(None),
        currency: Optional[str] = Query(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    from app.utils import is_admin
    is_admin(current_user)
    query = db.query(Expense)
    query = apply_filters(query, accountant_id, start_date, end_date, category, currency)
    expenses = query.all()
    return expenses

@router.get("/accountant/analytics", response_model=ExpenseAnalytics)
def get_accountant_expense_analytics(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    from app.utils import is_accountant
    is_accountant(current_user)
    expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
    return calculate_analytics(expenses)

@router.get("/admin/analytics", response_model=ExpenseAnalytics)
def get_admin_expense_analytics(
        accountant_id: Optional[int] = Query(None),
        start_date: Optional[str] = Query(None),
        end_date: Optional[str] = Query(None),
        category: Optional[str] = Query(None),
        currency: Optional[str] = Query(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    from app.utils import is_admin
    is_admin(current_user)
    query = db.query(Expense)
    query = apply_filters(query, accountant_id, start_date, end_date, category, currency)
    expenses = query.all()
    return calculate_analytics(expenses)
