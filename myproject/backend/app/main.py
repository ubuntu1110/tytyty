import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
import logging

from app.database import SessionLocal, engine, Base
from app.models import User, Chat, Notification
from app.utils import get_password_hash
from datetime import datetime, timedelta

from app.scheduler_manager import scheduler
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.chats import router as chats_router
from app.routers import expenses
from app.routers import proxies

app = FastAPI(
    title="MyAdmin Backend",
    description="API для управления пользователями, расходами, чаты, прокси и т.д.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn")
logging.basicConfig(level=logging.INFO)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc}")
    errors = [{k: v for k, v in err.items() if k != 'input'} for err in exc.errors()]
    return JSONResponse(
        status_code=400,
        content={"detail": errors},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP exception: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера"},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )

def check_chats_ending():
    db = SessionLocal()
    try:
        three_days_from_now = datetime.utcnow() + timedelta(days=3)
        chats_ending = db.query(Chat).filter(Chat.end_date <= three_days_from_now, Chat.removed == False).all()
        if chats_ending:
            moderators = db.query(User).filter(User.role == 'moderator').all()
            for ch in chats_ending:
                for mod in moderators:
                    notification = Notification(
                        user_id=mod.id,
                        message=f"Реклама в чате '{ch.chat_name}' скоро заканчивается! Продлите договор."
                    )
                    db.add(notification)
            db.commit()
            logger.info(f"Уведомления отправлены для {len(chats_ending)} чатов.")
    except Exception as e:
        logger.error(f"Ошибка в check_chats_ending: {e}")
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == 'admin').first()
        if not admin:
            admin_user = User(
                username='admin',
                hashed_password=get_password_hash('admin'),
                role='admin',
                active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            logger.info("Создан новый администратор.")
    except Exception as e:
        logger.error(f"Ошибка при создании администратора: {e}")
    finally:
        db.close()

    scheduler.add_job(check_chats_ending, 'cron', hour=0, minute=0)
    scheduler.start()
    logger.info("Scheduler запущен.")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(chats_router, prefix="/chats", tags=["chats"])
app.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
app.include_router(proxies.router, prefix="/proxies", tags=["proxies"])

@app.get("/")
def read_root():
    logger.info("Получен запрос на корневой эндпоинт.")
    return {"message": "Server is running"}
