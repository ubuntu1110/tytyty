from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Удаляем default="admin" — теперь роль должна быть явно задана при создании пользователя
    role = Column(String, nullable=False)  # 'admin', 'moderator', 'accountant'
    active = Column(Boolean, default=True, nullable=False)
    accountant_city = Column(String, nullable=True)

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    chat_name = Column(String, index=True, nullable=False)
    chat_link = Column(String, nullable=False)
    chat_id_str = Column(String, unique=True, default="unknown", nullable=False)
    price = Column(Float, nullable=False)
    city = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    days = Column(Float, nullable=False)
    end_date = Column(DateTime, nullable=False)
    number_of_people = Column(Float, default=0, nullable=False)
    removed = Column(Boolean, default=False, nullable=False)
    chat_id_real = Column(Integer, nullable=True)
    access_hash = Column(String, nullable=True)
    is_channel = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    quantity = Column(Float, nullable=True)
    currency = Column(String, default="RUB", nullable=False)
    goal = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Proxy(Base):
    __tablename__ = "proxies"
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True, nullable=False)
    port = Column(Integer, nullable=False)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
