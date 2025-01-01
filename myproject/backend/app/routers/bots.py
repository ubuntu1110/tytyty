# backend/app/routers/bots.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import shutil
import os
import logging

from app.database import get_db
from app.models import User, BotUser, BroadcastHistory, BroadcastStatusRecord, BroadcastError
from app.schemas import (
    BotUserOut,
    BroadcastRequest,
    BroadcastHistoryItemOut,
    BroadcastErrorOut,
    BroadcastStatus
)
from app.utils import get_current_user, is_admin

from app.bot.client import send_broadcast

router = APIRouter()
logger = logging.getLogger("uvicorn")

@router.get("/info/clients", response_model=List[BotUserOut])
def get_bot_clients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logger.info("Получен запрос на /bots/info/clients")
    is_admin(current_user)
    clients = db.query(BotUser).all()
    logger.info(f"Найдено {len(clients)} клиентов")
    return clients

@router.post("/info/broadcast")
def broadcast_message(
        broadcast: BroadcastRequest,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    logger.info("Получен запрос на /bots/info/broadcast")
    is_admin(current_user)

    # Создаем запись о новой рассылке
    new_broadcast = BroadcastHistory(
        text=broadcast.text,
        image_url=broadcast.image_url,
        scheduled_for=datetime.utcnow(),  # Немедленная рассылка
        status="in_progress",
        success_count=0,
        failed_count=0
    )
    db.add(new_broadcast)
    db.commit()
    db.refresh(new_broadcast)

    # Добавляем задачу рассылки в фоновое выполнение
    background_tasks.add_task(send_broadcast, new_broadcast.id)
    logger.info(f"Запланирована рассылка с ID {new_broadcast.id}")

    return {
        "message": "Broadcast scheduled",
        "broadcast_id": new_broadcast.id,
        "status": new_broadcast.status
    }

@router.post("/info/broadcast/schedule")
def schedule_broadcast(
        broadcast: BroadcastRequest,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    logger.info("Получен запрос на /bots/info/broadcast/schedule")
    is_admin(current_user)

    # Отложенная рассылка
    dt = datetime.fromisoformat(broadcast.datetime) if broadcast.datetime else datetime.utcnow()

    # Создаем запись о запланированной рассылке
    history = BroadcastHistory(
        text=broadcast.text,
        image_url=broadcast.image_url,
        scheduled_for=dt,
        status="scheduled",
        success_count=0,
        failed_count=0
    )
    db.add(history)
    db.commit()
    db.refresh(history)

    # Здесь можно добавить задачу для выполнения рассылки в определённое время
    # Например, используя планировщик задач, если он настроен

    logger.info(f"Рассылка запланирована с ID {history.id} на {dt}")
    return {"message": "Broadcast scheduled", "broadcast_id": history.id}

@router.get("/info/broadcast/history", response_model=List[BroadcastHistoryItemOut])
def get_broadcast_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logger.info("Получен запрос на /bots/info/broadcast/history")
    is_admin(current_user)
    try:
        records = db.query(BroadcastHistory).order_by(BroadcastHistory.created_at.desc()).all()
        logger.info(f"Найдено {len(records)} записей в истории рассылок")
        return records
    except Exception as e:
        logger.error(f"Ошибка при получении истории рассылок: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении истории рассылок")

@router.get("/info/broadcast/{broadcast_id}/errors", response_model=List[BroadcastErrorOut])
def get_broadcast_errors(broadcast_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logger.info(f"Получен запрос на /bots/info/broadcast/{broadcast_id}/errors")
    is_admin(current_user)
    errors = db.query(BroadcastError).filter(BroadcastError.broadcast_id == broadcast_id).all()
    logger.info(f"Найдено {len(errors)} ошибок для рассылки ID {broadcast_id}")
    return errors

@router.get("/info/broadcast/status", response_model=BroadcastStatus)
def get_broadcast_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logger.info("Получен запрос на /bots/info/broadcast/status")
    is_admin(current_user)
    status_record = db.query(BroadcastStatusRecord).first()
    if not status_record:
        return {"success": 0, "failed": 0}
    return {
        "success": status_record.success,
        "failed": status_record.failed
    }

@router.post("/info/upload")
async def upload_image(
        image: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    logger.info("Получен запрос на /bots/info/upload")
    is_admin(current_user)

    upload_folder = "static/images"
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    image_url = f"http://localhost:8000/{file_path.replace('\\', '/')}"  # Исправление пути для URL
    logger.info(f"Изображение загружено: {image_url}")
    return {"image_url": image_url}
