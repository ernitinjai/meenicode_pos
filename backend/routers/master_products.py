from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas
from backend.database import get_db
import uuid

router = APIRouter(
    prefix="/master-products",
    tags=["Master Products"]
)

# Create
@router.post("/", response_model=schemas.MasterProductSchema)
def create_master_product(product: schemas.MasterProductCreate, db: Session = Depends(get_db)):
    product_id = str(uuid.uuid4())
    db_product = models.MasterProduct(id=product_id, **product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Get all
@router.get("/", response_model=List[schemas.MasterProductSchema])
def get_all_master_products(db: Session = Depends(get_db)):
    return db.query(models.MasterProduct).all()

# Get by ID
@router.get("/{product_id}", response_model=schemas.MasterProductSchema)
def get_master_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Update
@router.put("/{product_id}", response_model=schemas.MasterProductSchema)
def update_master_product(product_id: str, updated_product: schemas.MasterProductCreate, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated_product.dict().items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

# Delete
@router.delete("/{product_id}")
def delete_master_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.MasterProduct).filter(models.MasterProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": f"Master Product {product_id} deleted successfully"}
