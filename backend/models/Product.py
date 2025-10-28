import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Product(Base):
    __tablename__ = "products"

    localId = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Local identifier
    masterProductId = Column(String, ForeignKey("master_products.id", ondelete="CASCADE"), nullable=False)
    shopId = Column(String, nullable=False)  # Foreign key to Shop table (if needed)

    salePrice = Column(Float, default=0.0)
    purchasePrice = Column(Float, default=0.0)
    remark = Column(String, default="")
    stock = Column(Integer, default=0)
    isSynced = Column(Boolean, default=False)
    isQuickSale = Column(Boolean, default=False)
    expiry = Column(String, default="NA")

    # Relationship to fetch master product details
    masterProduct = relationship("MasterProduct", backref="shopProducts")
