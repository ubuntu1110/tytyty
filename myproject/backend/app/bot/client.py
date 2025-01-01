# backend/app/bot/client.py

import os
from datetime import datetime
import logging
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters

from app.database import SessionLocal
from app.models import BroadcastHistory, BroadcastStatusRecord, BroadcastError, BotUser
from app.bot.handlers import start_handler, handle_message

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не установлен в переменных окружения")

application = None  # Глобальная переменная для приложения
is_bot_running = False  # Глобальный флаг для отслеживания состояния бота

def send_message_to_chat(chat_id: str, text: str):
    """Отправляет текстовое сообщение конкретному пользователю/чату."""
    application.bot.send_message(chat_id=chat_id, text=text)

def send_photo_to_chat(chat_id: str, photo_url: str, caption: str):
    """Отправляет фото конкретному пользователю/чату."""
    application.bot.send_photo(chat_id=chat_id, photo=photo_url, caption=caption)

def send_broadcast(broadcast_id: int):
    """
    Отправляет рассылку по всем подписанным пользователям, используя запись из BroadcastHistory.
    Обновляет счетчики успехов и неудач, а также статус рассылки и общую статистику.
    Логирует причины неудачных отправок.
    """
    db = SessionLocal()
    try:
        broadcast = db.query(BroadcastHistory).filter(BroadcastHistory.id == broadcast_id).first()
        if not broadcast:
            logger.error(f"Рассылка с ID {broadcast_id} не найдена.")
            return  # Не нашли рассылку, выходим

        clients = db.query(BotUser).all()

        success = 0
        failed = 0
        error_details = []  # Список для сбора информации об ошибках отправки

        for client in clients:
            try:
                if broadcast.image_url:
                    send_photo_to_chat(client.chat_id, broadcast.image_url, broadcast.text)
                else:
                    send_message_to_chat(client.chat_id, broadcast.text)
                success += 1
            except Exception as e:
                failed += 1
                # Записываем подробности ошибки для данного клиента
                error_info = {
                    "chat_id": client.chat_id,
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                }
                error_details.append(error_info)

                # Записываем ошибку в базу данных
                broadcast_error = BroadcastError(
                    broadcast_id=broadcast.id,
                    chat_id=client.chat_id,
                    error_type=type(e).__name__,
                    error_message=str(e),
                    timestamp=datetime.utcnow()
                )
                db.add(broadcast_error)

                logger.error(f"Не удалось отправить в chat_id {client.chat_id}: {type(e).__name__} - {e}")

        # Обновляем запись о рассылке
        broadcast.success_count = success
        broadcast.failed_count = failed
        broadcast.status = "completed" if failed == 0 else ("partially_failed" if failed < len(clients) else "failed")
        broadcast.updated_at = datetime.utcnow()

        # Обновляем или создаём запись общей статистики
        status_record = db.query(BroadcastStatusRecord).first()
        if not status_record:
            status_record = BroadcastStatusRecord(success=0, failed=0)
            db.add(status_record)
            db.commit()
            db.refresh(status_record)

        status_record.success += success
        status_record.failed += failed
        status_record.updated_at = datetime.utcnow()

        db.commit()

        # Если были ошибки, логируем их в консоль
        if error_details:
            logger.info("Неудачные отправки:")
            for err in error_details:
                logger.info(f"Чат: {err['chat_id']}, Ошибка: {err['error_type']} - {err['error_message']}")

    finally:
        db.close()

async def run_bot():
    """
    Запускает телеграм-бота.
    """
    global is_bot_running
    if is_bot_running:
        logger.info("Бот уже запущен. Пропуск запуска.")
        return
    is_bot_running = True

    try:
        global application
        application = ApplicationBuilder().token(BOT_TOKEN).build()

        # Регистрируем хендлеры
        application.add_handler(CommandHandler("start", start_handler))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

        # Запускаем бота
        await application.run_polling()
        logger.info("Бот успешно запущен.")
    except Exception as e:
        logger.error(f"Ошибка при запуске бота: {e}")
        is_bot_running = False
