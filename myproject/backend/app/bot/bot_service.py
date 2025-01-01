# backend/app/bot/bot_service.py

import os
import asyncio
import logging
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters

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
    logger.error("TELEGRAM_BOT_TOKEN не установлен в переменных окружения")
    exit(1)

async def main():
    application = ApplicationBuilder().token(BOT_TOKEN).build()

    # Регистрируем хендлеры
    application.add_handler(CommandHandler("start", start_handler))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Запускаем бота
    await application.run_polling()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Бот остановлен")
