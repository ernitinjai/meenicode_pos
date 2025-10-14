import uuid
from sqlalchemy import Column, String, Integer, Float, JSON
from database import Base

class MasterProduct(Base):
    __tablename__ = "master_products"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    productName = Column(String, default="Unknown")
    brand = Column(String, default="")
    barcode = Column(String, default="")
    unitQuantity = Column(Integer, default=0)
    unit = Column(String, default="")
    category = Column(String, default="")
    subcategory = Column(String, default="")
    description = Column(String, default="")
    imageUrls = Column(JSON, default=[])
