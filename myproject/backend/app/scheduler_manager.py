# backend/app/scheduler_manager.py

from apscheduler.schedulers.background import BackgroundScheduler
import pytz

# Инициализация планировщика с использованием часового пояса UTC из pytz
scheduler = BackgroundScheduler(timezone=pytz.UTC)
