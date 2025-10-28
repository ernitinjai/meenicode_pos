from database import Base
from sqlalchemy import Column, Integer, String

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
