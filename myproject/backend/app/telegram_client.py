# app/telegram_client.py
import os
from telegram import Update, Bot
from telegram.ext import Updater, CommandHandler, CallbackContext
from app.database import SessionLocal
from app.models import BotUser
from datetime import datetime

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
bot = Bot(token=BOT_TOKEN)

def start(update: Update, context: CallbackContext):
    db = SessionLocal()
    chat_id = str(update.effective_chat.id)
    username = update.effective_user.username
    first_name = update.effective_user.first_name
    last_name = update.effective_user.last_name
    user = db.query(BotUser).filter(BotUser.chat_id == chat_id).first()
    if not user:
        user = BotUser(chat_id=chat_id, username=username, first_name=first_name, last_name=last_name, created_at=datetime.utcnow())
        db.add(user)
        db.commit()
    db.close()

    update.message.reply_text("Привет! Вы подписаны на инфо-бот.")

def send_message_to_chat(chat_id: str, text: str):
    bot.send_message(chat_id=chat_id, text=text)

def send_photo_to_chat(chat_id: str, photo_url: str, caption: str):
    bot.send_photo(chat_id=chat_id, photo=photo_url, caption=caption)

def run_bot():
    updater = Updater(token=BOT_TOKEN, use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    updater.start_polling()
    # updater.idle() - если нужно
