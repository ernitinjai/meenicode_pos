from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from database import get_db
import uuid

router = APIRouter()

# 🟢 Create Customer
@router.post("", response_model=schemas.CustomerSchema)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    customer_id = str(uuid.uuid4())
    db_customer = models.Customer(id=customer_id, **customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


# 🟢 Get All Customers
@router.get("", response_model=List[schemas.CustomerSchema])
def get_all_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()


# 🟢 Flexible Search: shopId / phone / email / name (any combination)
@router.get("/search", response_model=List[schemas.CustomerSchema])
def search_customers(
    shopId: Optional[str] = Query(None),
    phone: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Customer)

    if shopId:
        query = query.filter(models.Customer.shopId == shopId)
    if phone:
        query = query.filter(models.Customer.phone == phone)
    if email:
        query = query.filter(models.Customer.email == email)
    if name:
        query = query.filter(models.Customer.name.ilike(f"%{name}%"))

    results = query.all()
    return results


# 🟢 Update Customer
@router.put("/{customer_id}", response_model=schemas.CustomerSchema)
def update_customer(customer_id: str, updated_customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for key, value in updated_customer.dict().items():
        setattr(db_customer, key, value)

    db.commit()
    db.refresh(db_customer)
    return db_customer


# 🟢 Delete Customer
@router.delete("/{customer_id}")
def delete_customer(customer_id: str, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(db_customer)
    db.commit()
    return {"message": f"Customer {customer_id} deleted successfully"}
