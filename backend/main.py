
import time
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
import models, schemas
import cloudinary
import cloudinary.utils
from mangum import Mangum



# Create tables
Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost:8081",  # your local dev URL
    "http://meenicode-frontend.s3-website.ap-south-1.amazonaws.com",  # deployed frontend
    "*"  # optional, allow all origins
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.put("/products/{product_id}", response_model=schemas.ProductSchema)
def update_product(product_id: int, updated_product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated_product.dict().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


# 🔴 4. Delete Product
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
    return {"message": f"Product ID {product_id} deleted successfully"}

@app.get("/shops", response_model=List[schemas.ShopSchema])
def get_shops(db: Session = Depends(get_db)):
    return db.query(models.Shop).all()

@app.post("/shops", response_model=schemas.ShopSchema)
def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db)):
    # Create unique ID as shopname_phonenumber
    shop_id = f"{shop.shopName}_{shop.phoneNumber}"
    
    # Check duplicate
    existing = db.query(models.Shop).filter(models.Shop.id == shop_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Shop already exists with this name and phone number")

    db_shop = models.Shop(id=shop_id, **shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

@app.post("/shops/login")
def login_shop(shop_login: schemas.ShopLogin, db: Session = Depends(get_db)):
    shop = db.query(models.Shop).filter(models.Shop.email == shop_login.email).first()

    if not shop:
        return {"success": False, "message": "Email not found"}

    if shop.password != shop_login.password:
        return {"success": False, "message": "Incorrect password"}

    return {
        "success": True,
        "message": "Login successful",
        "shop": {
            "id": shop.id,
            "shopName": shop.shopName,
            "ownerName": shop.ownerName,
            "shopCategory": shop.shopCategory,
            "email": shop.email,
            "phoneNumber": shop.phoneNumber,
            "address": shop.address,
        }
    }

@app.get("/shops/{shop_name}")
def get_shop_by_name(shop_name: str, db: Session = Depends(get_db)):
    shop = db.query(models.Shop).filter(models.Shop.shopName == shop_name).first()
    if not shop:
        return {"success": False, "message": "shop not found"}
    
    return {
        "shopName": shop.shopName,
        "ownerName": shop.ownerName,
        "address": shop.address,
        "shopCategory": shop.shopCategory,
        "email": shop.email,
        "phoneNumber": shop.phoneNumber
    }

cloudinary.config(
    cloud_name="dcra3g9sk",
    api_key="886161733275543",
    api_secret="GJAjOIJCEobqTyvMdCW5XvqVMOc"
)  

@app.get("/cloudinary-sign")
async def cloudinary_sign():
    """
    Generate signed params for Cloudinary uploads.
    Compose app will call this function.
    """
    timestamp = int(time.time())
    
    # Add additional options if you want folder, public_id, etc.
    params_to_sign = {"timestamp": timestamp,
                      "folder": "meenicode",
                      "eager": "c_crop,w_100,h_100,e_background_removal"}
    
    signature = cloudinary.utils.api_sign_request(
        params_to_sign,
        cloudinary.config().api_secret
    )

    return JSONResponse(content={
        "signature": signature,
        "timestamp": timestamp,
        "api_key": cloudinary.config().api_key,
        "cloud_name": cloudinary.config().cloud_name,
        "folder": "meenicode"
    })

#app.include_router(products.router, prefix="/products", tags=["Products"])
#app.include_router(customers.router, prefix="/customers", tags=["Customers"])
handler = Mangum(app)
#if __name__ == "__main__":
    #import uvicorn
    #uvicorn.run("main:app", host="0.0.0.0", port=8000)
    
    
