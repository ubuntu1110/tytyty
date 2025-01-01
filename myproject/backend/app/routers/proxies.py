# backend/app/routers/proxies.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Proxy, User
from app.schemas import ProxyCreate, ProxyOut, ProxyUpdate
from app.utils import get_current_user, is_admin, is_accountant

router = APIRouter()

@router.get("/admin", response_model=List[ProxyOut])
def get_all_proxies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Получить все прокси для администратора.
    Доступ: только admin.
    """
    is_admin(current_user)
    proxies = db.query(Proxy).all()
    return proxies

@router.post("/admin", response_model=ProxyOut)
def create_proxy(proxy: ProxyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Создать новый прокси. Доступно только админу.
    """
    is_admin(current_user)
    existing = db.query(Proxy).filter(Proxy.ip_address == proxy.ip_address, Proxy.port == proxy.port).first()
    if existing:
        raise HTTPException(status_code=400, detail="Proxy already exists")

    new_proxy = Proxy(
        ip_address=proxy.ip_address,
        port=proxy.port,
        username=proxy.username,
        password=proxy.password
    )
    db.add(new_proxy)
    try:
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Не удалось сохранить прокси")
    db.refresh(new_proxy)
    return new_proxy

@router.put("/admin/assign/{proxy_id}", response_model=ProxyOut)
def assign_proxy_to_accountant(proxy_id: int, accountant_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Назначить прокси бухгалтеру. Доступ: только admin.
    """
    is_admin(current_user)
    proxy = db.query(Proxy).filter(Proxy.id == proxy_id).first()
    if not proxy:
        raise HTTPException(status_code=404, detail="Proxy not found")

    accountant = db.query(User).filter(User.id == accountant_id, User.role == 'accountant').first()
    if not accountant:
        raise HTTPException(status_code=404, detail="Accountant not found")

    proxy.assigned_to = accountant.id
    try:
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Не удалось назначить прокси бухгалтеру")
    db.refresh(proxy)
    return proxy

@router.put("/admin/{proxy_id}", response_model=ProxyOut)
def update_proxy(proxy_id: int, proxy_data: ProxyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Обновить прокси (IP, port, username, password).
    Доступ: только admin.
    """
    is_admin(current_user)
    proxy = db.query(Proxy).filter(Proxy.id == proxy_id).first()
    if not proxy:
        raise HTTPException(status_code=404, detail="Proxy not found")

    if proxy_data.ip_address is not None:
        existing = db.query(Proxy).filter(Proxy.ip_address == proxy_data.ip_address, Proxy.port == proxy_data.port, Proxy.id != proxy_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Proxy already exists with that IP and port")
        proxy.ip_address = proxy_data.ip_address
    if proxy_data.port is not None:
        proxy.port = proxy_data.port
    if proxy_data.username is not None:
        proxy.username = proxy_data.username
    if proxy_data.password is not None:
        proxy.password = proxy_data.password

    try:
        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Не удалось обновить прокси")
    db.refresh(proxy)
    return proxy

@router.get("/accountant", response_model=List[ProxyOut])
def get_accountant_proxies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Получить список прокси для бухгалтера.
    Доступ: только accountant.
    """
    is_accountant(current_user)
    proxies = db.query(Proxy).filter(Proxy.assigned_to == current_user.id).all()
    return proxies
