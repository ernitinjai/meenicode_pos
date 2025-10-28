from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend import models, schemas
from backend.database import get_db

router = APIRouter(prefix="/products", tags=["Products"])

# Create product
@router.post("/", response_model=schemas.ProductSchema)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Get all products (optionally filter by shopId)
@router.get("/", response_model=List[schemas.ProductSchema])
def get_products(shopId: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if shopId:
        query = query.filter(models.Product.shopId == shopId)
    return query.all()

# Get by localId
@router.get("/{localId}", response_model=schemas.ProductSchema)
def get_product(localId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.localId == localId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Update
@router.put("/{localId}", response_model=schemas.ProductSchema)
def update_product(localId: int, updated_product: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.localId == localId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in updated_product.dict().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

# Delete
@router.delete("/{localId}")
def delete_product(localId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.localId == localId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product {localId} deleted successfully"}
