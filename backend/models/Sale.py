from backend.database import Base
from sqlalchemy import Column, Integer, TIMESTAMP, DECIMAL, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship


class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    total_amount = Column(DECIMAL)
    sale_date = Column(TIMESTAMP, default=datetime.utcnow)
    items = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(DECIMAL)
    subtotal = Column(DECIMAL)
    sale = relationship("Sale", back_populates="items")