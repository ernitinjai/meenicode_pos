from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    # Example data, replace with DB query
    return [
        {"id": "1", "productName": "Milk", "brand": "Amul", "stock": 120},
        {"id": "2", "productName": "Bread", "brand": "Britannia", "stock": 50},
    ]
