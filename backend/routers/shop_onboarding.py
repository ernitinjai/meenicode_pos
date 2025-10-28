from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.ShopSchema])
def get_shops(db: Session = Depends(get_db)):
    return db.query(models.Shop).all()

@router.post("/", response_model=schemas.ShopSchema)
def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db)):
    shop_id = f"{shop.shopName}_{shop.phoneNumber}"
    if db.query(models.Shop).filter(models.Shop.id == shop_id).first():
        raise HTTPException(status_code=400, detail="Shop already exists")

    db_shop = models.Shop(id=shop_id, **shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

@router.post("/login")
def login_shop(shop_login: schemas.ShopLogin, db: Session = Depends(get_db)):
    shop = db.query(models.Shop).filter(models.Shop.email == shop_login.email).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Email not found")

    if shop.password != shop_login.password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {"success": True, "shop": shop}
