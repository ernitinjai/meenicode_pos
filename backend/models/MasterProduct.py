import uuid
from xmlrpc.client import Boolean
from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, Boolean
from database import Base
from datetime import datetime
from sqlalchemy.sql import func

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
    isLoose = Column(Boolean,default=False)
    looseUnitQuantityInBox = Column(Integer, default =1)
    updatedAt = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
