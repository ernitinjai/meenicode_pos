
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
import models, schemas

# Create tables
Base.metadata.create_all(bind=engine)


app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products", response_model=List[schemas.ProductSchema])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.post("/products", response_model=schemas.ProductSchema)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

#app.include_router(products.router, prefix="/products", tags=["Products"])
#app.include_router(customers.router, prefix="/customers", tags=["Customers"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
