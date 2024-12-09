from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="accountant")
    city = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)

    expenses = relationship("Expense", back_populates="owner")
    chats = relationship("Chat", back_populates="owner")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    comment = Column(String, nullable=True)
    date = Column(Date, default=date.today())
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    link = Column(String)
    price = Column(Float)
    purchase_date = Column(Date, default=date.today())
    expiration_days = Column(Integer)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="chats")
    owner_username = Column(String, nullable=True)
    owner_wallet = Column(String, nullable=False)

class Holiday(Base):
    __tablename__ = "holidays"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date = Column(Date, index=True)
