from database import Base
from sqlalchemy import Column, String

class Shop(Base):
    __tablename__ = "shops"

    id = Column(String, primary_key=True, index=True)  # e.g. shopname_phonenumber
    shopName = Column(String, nullable=False)
    ownerName = Column(String, nullable=False)
    shopCategory = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phoneNumber = Column(String, nullable=False)
    address = Column(String, nullable=False)
    password = Column(String, nullable=False)