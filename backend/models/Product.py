import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    localId = Column(String, default ="localId")  # Local identifier
    localProductName = Column(String, default="default p name")
    masterProductId = Column(String, ForeignKey("master_products.id", ondelete="CASCADE"), nullable=False)
    shopId = Column(String, nullable=False)  # Foreign key to Shop table (if needed)

    salePrice = Column(Float, default=0.0)
    purchasePrice = Column(Float, default=0.0)
    remark = Column(String, default="")
    stock = Column(Integer, default=0)
    isSynced = Column(Boolean, default=False)
    isQuickSale = Column(Boolean, default=False)
    expiry = Column(String, default="NA")
    updatedAt = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationship to fetch master product details
    masterProduct = relationship("MasterProduct", backref="shopProducts")
