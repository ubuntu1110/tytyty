from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    active: bool
    accountant_city: Optional[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    accountant_city: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: Optional[str] = None

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class ChatBase(BaseModel):
    chat_name: str
    chat_link: str
    price: float
    city: str
    owner: str
    days: float

class ChatOut(ChatBase):
    id: int
    end_date: datetime
    number_of_people: float
    removed: bool
    chat_id_str: str

    class Config:
        from_attributes = True

class ChatCreate(ChatBase):
    pass

class ChatUpdate(BaseModel):
    chat_name: Optional[str] = None
    chat_link: Optional[str] = None
    price: Optional[float] = None
    city: Optional[str] = None
    owner: Optional[str] = None
    days: Optional[float] = None

class ChatsStatsOut(BaseModel):
    total_chats: int
    total_spent: float

class NotificationOut(BaseModel):
    id: int
    user_id: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    category: str
    amount: float
    quantity: Optional[float] = None
    currency: str = "RUB"
    goal: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    quantity: Optional[float] = None
    currency: Optional[str] = None
    goal: Optional[str] = None

class ExpenseOut(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExpenseAnalytics(BaseModel):
    total_spent_rub: float
    total_count_rub: float
    category_data_rub: Dict[str, Dict[str, float]]

    total_spent_usd: float
    total_count_usd: float
    category_data_usd: Dict[str, Dict[str, float]]

    weekly_comparison: str
    monthly_comparison: str

class CityUpdate(BaseModel):
    accountant_city: str

    class Config:
        from_attributes = True

# Схемы для прокси
class ProxyBase(BaseModel):
    ip_address: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None

class ProxyCreate(ProxyBase):
    pass

class ProxyUpdate(BaseModel):
    ip_address: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None

class ProxyOut(ProxyBase):
    id: int
    assigned_to: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
