from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, date

from app.database import get_db
from app.models import Chat, User
from app.schemas import ChatOut, ChatCreate, ChatUpdate, ChatsStatsOut
from app.utils import get_current_user, is_moderator_or_admin, is_admin

router = APIRouter()

@router.post("/", response_model=ChatOut)
def create_chat(chat: ChatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Чаты могут создавать админ или модератор
    if current_user.role not in ['admin', 'moderator']:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    end_date = datetime.utcnow() + timedelta(days=chat.days)
    new_chat = Chat(
        chat_name=chat.chat_name,
        chat_link=chat.chat_link,
        price=chat.price,
        city=chat.city,
        owner=chat.owner,
        days=chat.days,
        end_date=end_date,
        chat_id_str="unknown"
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.get("/", response_model=List[ChatOut])
def get_chats(city: Optional[str] = Query(None, description="Город для фильтрации чатов"), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_moderator_or_admin(current_user)

    # Если пользователь бухгалтер, используем accountant_city
    if current_user.role == 'accountant':
        if not current_user.accountant_city:
            raise HTTPException(status_code=400, detail="Accountant city not set")
        city = current_user.accountant_city

    query = db.query(Chat)
    if city:
        query = query.filter(Chat.city == city)
    chats = query.all()
    for ch in chats:
        if ch.chat_id_str is None:
            ch.chat_id_str = "unknown"
    return chats

@router.get("/stats", response_model=ChatsStatsOut)
def get_chats_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    total_chats = db.query(Chat).count()
    total_spent = db.query(Chat.price).all()
    total_spent_sum = sum(c[0] for c in total_spent if c[0] is not None)
    return ChatsStatsOut(total_chats=total_chats, total_spent=total_spent_sum)

@router.get("/analytics", response_model=Dict[str, Any])
def get_chats_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    chats = db.query(Chat).all()

    for ch in chats:
        if ch.chat_id_str is None:
            ch.chat_id_str = "unknown"

    if not chats:
        return {
            "total": {
                "count": 0,
                "spent": 0
            },
            "weeks": [],
            "month": {
                "current_month": {
                    "count": 0,
                    "spent": 0
                },
                "previous_month": {
                    "count": 0,
                    "spent": 0
                },
                "comparison": {
                    "count": "на том же уровне",
                    "spent": "на том же уровне"
                }
            }
        }

    total_count = len(chats)
    total_spent = sum(ch.price for ch in chats if ch.price is not None)

    earliest_chat = min(chats, key=lambda c: c.created_at)
    earliest_date = earliest_chat.created_at.date()
    now_date = datetime.utcnow().date()

    weeks_data = []
    current_start = earliest_date
    while current_start <= now_date:
        current_end = current_start + timedelta(days=6)
        week_chats = [ch for ch in chats if current_start <= ch.created_at.date() <= current_end]
        week_count = len(week_chats)
        week_spent = sum(ch.price for ch in week_chats if ch.price is not None)
        weeks_data.append({
            "start_date": current_start.isoformat(),
            "end_date": current_end.isoformat(),
            "count": week_count,
            "spent": week_spent
        })
        current_start = current_end + timedelta(days=1)

    today = date.today()
    current_month_start = today.replace(day=1)
    if today.month == 1:
        prev_month_year = today.year - 1
        prev_month = 12
    else:
        prev_month_year = today.year
        prev_month = today.month - 1

    previous_month_start = date(prev_month_year, prev_month, 1)
    previous_month_end = current_month_start - timedelta(days=1)

    current_month_chats = [ch for ch in chats if ch.created_at.date() >= current_month_start]
    prev_month_chats = [ch for ch in chats if previous_month_start <= ch.created_at.date() <= previous_month_end]

    current_month_count = len(current_month_chats)
    current_month_spent = sum(ch.price for ch in current_month_chats if ch.price is not None)

    prev_month_count = len(prev_month_chats)
    prev_month_spent = sum(ch.price for ch in prev_month_chats if ch.price is not None)

    if current_month_count > prev_month_count:
        count_compare = "лучше"
    elif current_month_count < prev_month_count:
        count_compare = "хуже"
    else:
        count_compare = "на том же уровне"

    if current_month_spent > prev_month_spent:
        spent_compare = "лучше"
    elif current_month_spent < prev_month_spent:
        spent_compare = "хуже"
    else:
        spent_compare = "на том же уровне"

    return {
        "total": {
            "count": total_count,
            "spent": total_spent
        },
        "weeks": weeks_data,
        "month": {
            "current_month": {
                "count": current_month_count,
                "spent": current_month_spent
            },
            "previous_month": {
                "count": prev_month_count,
                "spent": prev_month_spent
            },
            "comparison": {
                "count": count_compare,
                "spent": spent_compare
            }
        }
    }

@router.put("/{chat_id}", response_model=ChatOut)
def update_chat_info(chat_id: int, chat_update: ChatUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Обновление чата - для админа или модератора
    if current_user.role not in ['admin', 'moderator']:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    existing_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not existing_chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat_update.chat_name is not None:
        existing_chat.chat_name = chat_update.chat_name
    if chat_update.chat_link is not None:
        existing_chat.chat_link = chat_update.chat_link
        if existing_chat.chat_id_str is None:
            existing_chat.chat_id_str = "unknown"
    if chat_update.price is not None:
        existing_chat.price = chat_update.price
    if chat_update.city is not None:
        existing_chat.city = chat_update.city
    if chat_update.owner is not None:
        existing_chat.owner = chat_update.owner
    if chat_update.days is not None:
        existing_chat.days = chat_update.days
        existing_chat.end_date = datetime.utcnow() + timedelta(days=chat_update.days)

    if existing_chat.chat_id_str is None:
        existing_chat.chat_id_str = "unknown"

    db.commit()
    db.refresh(existing_chat)
    return existing_chat
