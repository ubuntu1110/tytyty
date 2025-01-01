# backend/app/bot/handlers.py

from telegram import Update
from telegram.ext import ContextTypes

from app.database import SessionLocal
from app.models import BotUser
from datetime import datetime

async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(f"Привет, {user.first_name}! Спасибо за регистрацию.")

    # Сохраняем пользователя в базе данных, если необходимо
    db = SessionLocal()
    try:
        chat_id = str(user.id)
        existing_user = db.query(BotUser).filter(BotUser.chat_id == chat_id).first()
        if not existing_user:
            new_user = BotUser(
                chat_id=chat_id,
                username=user.username,
                first_name=user.first_name,
                last_name=user.last_name,
                created_at=datetime.utcnow()
            )
            db.add(new_user)
            db.commit()
    finally:
        db.close()

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик текстовых сообщений."""
    text = update.message.text
    await update.message.reply_text(f"Вы сказали: {text}")
