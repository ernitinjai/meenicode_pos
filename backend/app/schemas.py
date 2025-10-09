# schemas.py
from pydantic import BaseModel
from typing import List, Optional

class ProductSchema(BaseModel):
    id: int
    name: str
    brand: str
    barcode: str
    unit: str
    unit_quantity: int
    selling_price: float
    purchase_price: float
    current_stock: int

    model_config = {
        "from_attributes": True
    }

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
