# backend/app/fix_broadcast_history.py

import sys
import os
from sqlalchemy.orm import Session

# Добавляем путь к директории 'app' в PYTHONPATH
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SessionLocal
from app.models import BroadcastHistory

def fix_broadcast_history():
    db: Session = SessionLocal()
    try:
        # Найти все записи с NULL в success_count или failed_count
        records_with_null = db.query(BroadcastHistory).filter(
            (BroadcastHistory.success_count == None) |
            (BroadcastHistory.failed_count == None)
        ).all()

        print(f"Найдено {len(records_with_null)} записей с NULL значениями.")

        for record in records_with_null:
            if record.success_count is None:
                record.success_count = 0
            if record.failed_count is None:
                record.failed_count = 0

        db.commit()
        print(f"Обновлено {len(records_with_null)} записей.")
    except Exception as e:
        db.rollback()
        print(f"Ошибка при обновлении записей: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_broadcast_history()
