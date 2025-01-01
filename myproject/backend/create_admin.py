# backend/create_admin.py

from app.database import SessionLocal, engine, Base
from app.models import User
from app.utils import get_password_hash
from datetime import datetime

def create_admin(username: str, password: str):
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.username == username).first()
        if existing_admin:
            print("Администратор уже существует.")
            return
        hashed_password = get_password_hash(password)
        admin = User(
            username=username,
            hashed_password=hashed_password,
            role="admin",
            active=True,
            created_at=datetime.utcnow()
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"Администратор {username} создан.")
    except Exception as e:
        db.rollback()
        print(f"Ошибка при создании администратора: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin("admin", "adminpassword")
