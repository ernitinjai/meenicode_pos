# schemas.py
from pydantic import BaseModel,EmailStr, constr
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    brand: str
    barcode: str
    unit: str
    unit_quantity: int
    selling_price: float
    purchase_price: float
    current_stock: int

class ProductSchema(ProductCreate):
    id: int
    model_config = {"from_attributes": True}    

class CustomerSchema(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]

    model_config = {
        "from_attributes": True
    }

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(BaseModel):
    customer_id: int
    items: List[SaleItemCreate]

class ShopBase(BaseModel):
    shopName: str
    ownerName: str
    shopCategory: str
    email: EmailStr
    phoneNumber: str
    address: str
    password: str

class ShopCreate(ShopBase):
    pass

class ShopSchema(ShopBase):
    id: str
    class Config:
        orm_mode = True

class ShopLogin(BaseModel):
    email: str
    password: str        



