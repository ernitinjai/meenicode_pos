from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from database import get_db
from datetime import datetime

router = APIRouter()

# Create product
@router.post("", response_model=schemas.ProductSchema)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {
        "message": "product created successfully"
    }

# Get all products (optionally filter by shopId)
@router.get("", response_model=List[schemas.ProductSchema])
def get_products(shopId: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if shopId:
        query = query.filter(models.Product.shopId == shopId)
    return query.all()

# Get by masterProductId
@router.get("/{masterProductId}", response_model=schemas.ProductSchema)
def get_product(masterProductId: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.masterProductId == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Update
@router.put("/{masterProductId}", response_model=schemas.ProductSchema)
def update_product(masterProductId: str, updated_product: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.masterProductId == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in updated_product.dict().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

# Delete
@router.delete("/{masterProductId}")
def delete_product(masterProductId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.masterProductId == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product {masterProductId} deleted successfully"}

@router.get("/updated_after/{utc_timestamp}", response_model=List[schemas.ProductSchema])
def get_products_updated_after(utc_timestamp: str, db: Session = Depends(get_db)):
    try:
        # Replace Z (Zulu) with +00:00 for Python parsing
        given_time = datetime.fromisoformat(utc_timestamp.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UTC timestamp format. Use ISO 8601 format.")

    updated_products = db.query(models.Product).filter(
        models.Product.updatedAt > given_time
    ).all()

    return updated_products

