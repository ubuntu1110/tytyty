from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.chats import update_chat_status, update_chat_id
from app.database import get_db
import requests

router = APIRouter()

@router.post("/check_chats")
def check_chats(db: Session = Depends(get_db)):
    chats = db.query(Chat).all()
    for chat in chats:
        if chat.chat_id:
            chat_info = fetch_chat_info(chat.chat_id)
            if chat_info:
                chat.is_active = True
                chat.subscribers = chat_info.get("subscribers", 0)
            else:
                chat.is_active = False
            db.commit()
    return {"message": "Chat statuses updated"}

def fetch_chat_info(chat_id: str) -> dict:
    # Подключение к Telegram API для проверки
    TELEGRAM_API_URL = f"https://api.telegram.org/bot<TOKEN>/getChatMemberCount"
    try:
        response = requests.get(TELEGRAM_API_URL, params={"chat_id": chat_id})
        if response.status_code == 200:
            data = response.json()
            return {"subscribers": data["result"]}
    except Exception as e:
        print(f"Error fetching chat info: {e}")
    return None

@router.put("/update_chat_id/{chat_id}")
def change_chat_id(chat_id: int, new_chat_id: str, db: Session = Depends(get_db)):
    return update_chat_id(db, chat_id, new_chat_id)
