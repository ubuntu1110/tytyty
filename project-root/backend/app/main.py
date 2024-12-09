import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, get_db
from app.models import User
from app.schemas import UserCreate
from app.crud import authenticate_user, create_user
from app.auth import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from app.users import router as user_router
from app.data import router as data_router

app = FastAPI(title="Accounting Automation App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

db = next(get_db())
if not db.query(User).first():
    admin_user = UserCreate(username="admin", password="adminpass", is_admin=True, role="admin")
    create_user(db, admin_user)
    # Создадим 5 бухгалтеров
    for i in range(1,6):
        acc_user = UserCreate(username=f"accountant{i}", password=f"pass{i}", is_admin=False, role="accountant")
        create_user(db, acc_user)
    # Создадим одного модератора для проверки
    mod_user = UserCreate(username="moderator1", password="modpass", is_admin=False, role="moderator")
    create_user(db, mod_user)

app.include_router(user_router, prefix="/admin", tags=["admin"])
app.include_router(data_router, prefix="/data", tags=["data"])

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session=Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token(data={"sub": user.username, "is_admin": user.is_admin, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

db = next(get_db())
if not db.query(User).first():
    admin_user = UserCreate(username="admin", password="adminpass", is_admin=True, role="admin")
    create_user(db, admin_user)
    for i in range(1,6):
        acc_user = UserCreate(username=f"accountant{i}", password=f"pass{i}", is_admin=False, role="accountant")
        create_user(db, acc_user)
    mod_user = UserCreate(username="moderator1", password="modpass", is_admin=False, role="moderator")
    create_user(db, mod_user)

    # Добавим несколько праздников
    from app.crud import create_holiday
    create_holiday(db, "Новый год", date(2024, 1, 1))
    create_holiday(db, "День бухгалтера", date(2024, 4, 10))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
