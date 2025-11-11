from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

# Create
@router.post("", response_model=schemas.MasterProductSchema)
def create_master_product(product: schemas.MasterProductCreate, db: Session = Depends(get_db)):
    db_product = models.MasterProduct(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {
        "message": "Master product created successfully"
    }

# Get all
def sanitize_master_product_data(entity: models.MasterProduct):
    """Convert ORM entity to sanitized dict so no nulls reach the client."""
    return {
        "id": entity.id,
        "productName": entity.productName or "Unknown",
        "brand": entity.brand or "",
        "barcode": entity.barcode or "",
        "unitQuantity": entity.unitQuantity or 0,
        "unit": entity.unit or "",
        "category": entity.category or "",
        "subcategory": entity.subcategory or "",
        "description": entity.description or "",
        "imageUrls": entity.imageUrls if isinstance(entity.imageUrls, list) else [],
        "isLoose": bool(entity.isLoose) if entity.isLoose is not None else False,
        "looseUnitQuantityInBox": entity.looseUnitQuantityInBox or 1,
        "updatedAt": entity.updatedAt,
    }


@router.get("", response_model=list[schemas.MasterProductSchema])
def get_all_master_products(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    master_products = db.query(models.MasterProduct).offset(skip).limit(limit).all()
    sanitized = [sanitize_master_product_data(p) for p in master_products]
    return sanitized

# Get by ID
@router.get("/{masterProductId}", response_model=schemas.MasterProductSchema)
def get_master_product(masterProductId: str, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Update
@router.post("/{masterProductId}", response_model=schemas.MasterProductSchema)
def update_master_product(masterProductId: str, updated_product: schemas.MasterProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated_product.dict().items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

# Delete
@router.delete("/{masterProductId}")
def delete_master_product(masterProductId: str, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == masterProductId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": f"Master Product {masterProductId} deleted successfully"}


@router.get("/updated_after/{utc_timestamp}", response_model=List[schemas.MasterProductSchema])
def get_products_updated_after(utc_timestamp: str, db: Session = Depends(get_db)):
    try:
        # Replace Z (Zulu) with +00:00 for Python parsing
        given_time = datetime.fromisoformat(utc_timestamp.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UTC timestamp format. Use ISO 8601 format.")

    updated_products = db.query(models.MasterProduct).filter(
        models.MasterProduct.updatedAt > given_time
    ).all()

    return updated_products

