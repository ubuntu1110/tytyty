from sqlalchemy.orm import Session
from app.models import Chat

def update_chat_status(db: Session, chat_id: int, is_active: bool, subscribers: int):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        chat.is_active = is_active
        chat.subscribers = subscribers
        db.commit()
        db.refresh(chat)
    return chat

def update_chat_id(db: Session, chat_id: int, new_chat_id: str):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise Exception("Chat not found")
    chat.chat_id = new_chat_id
    chat.is_active = True  # Считаем, что новый чат активен
    db.commit()
    db.refresh(chat)
    return chat
