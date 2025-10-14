# schemas.py
from pydantic import BaseModel,EmailStr
from typing import List, Optional   

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

class CustomerBase(BaseModel):
    name: str
    email: str
    phoneNumber: str
    address: str
    shopId: str


# 🟢 For creating or updating a customer (client input)
class CustomerCreate(CustomerBase):
    pass


# 🟢 For returning customer data (with id)
class CustomerSchema(CustomerBase):
    id: str

    class Config:
        orm_mode = True

class MasterProductBase(BaseModel):
    productName: str
    brand: str
    barcode: str
    unitQuantity: int
    unit: str
    category: str
    subcategory: str
    description: str
    imageUrls: List[str] = []

class MasterProductCreate(MasterProductBase):
    pass

class MasterProductSchema(MasterProductBase):
    id: str

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    shopId: str
    masterProductId: str
    salePrice: float = 0.0
    purchasePrice: float = 0.0
    remark: str = ""
    stock: int = 0
    isQuickSale: bool = False
    expiry: str = "NA"

class ProductCreate(ProductBase):
    pass

class ProductSchema(ProductBase):
    localId: int

    class Config:
        orm_mode = True


