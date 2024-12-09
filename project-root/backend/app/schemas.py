from pydantic import BaseModel
from datetime import date
from typing import Optional

class ConfigBase(BaseModel):
    class Config:
        from_attributes = True

class UserBase(ConfigBase):
    username: str
    city: Optional[str] = None
    role: str = "accountant"

class UserCreate(UserBase):
    password: str
    is_admin: bool = False

class UserUpdate(BaseModel):
    username: Optional[str]
    password: Optional[str]
    role: Optional[str]
    city: Optional[str]

class UserRead(UserBase):
    id: int
    is_admin: bool

class ExpenseBase(ConfigBase):
    amount: float
    category: str
    date: Optional[date] = None
    comment: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseRead(ExpenseBase):
    id: int
    owner_id: int

class ChatBase(ConfigBase):
    name: str
    link: str
    price: float
    purchase_date: Optional[date] = None
    expiration_days: int

class ChatCreate(ChatBase):
    pass

class ChatRead(ChatBase):
    id: int
    owner_id: int

class AnalyticsRequest(BaseModel):
    period: str  # day, week, month
    city: Optional[str] = None
    category: Optional[str] = None

class AnalyticsResponse(BaseModel):
    total_amount: float
    total_chats: int
    total_expenses: int

class ChatBase(ConfigBase):
    name: str
    link: str
    price: float
    purchase_date: Optional[date] = None
    expiration_days: int
    owner_username: Optional[str] = None  # необязательно
    owner_wallet: str                     # обязательно

class ChatCreate(ChatBase):
    pass

class ChatRead(ChatBase):
    id: int
    owner_id: int

class HolidayBase(ConfigBase):
    name: str
    date: date

class HolidayCreate(HolidayBase):
    pass

class HolidayRead(HolidayBase):
    id: int
