import uuid
from database import Base
from sqlalchemy import Column, Integer, String, JSON

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) 
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    shopId = Column(JSON, default=list) 
