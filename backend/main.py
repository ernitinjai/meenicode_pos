from routers import shop_onboarding
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from database import Base, engine
from routers import products, customers, cloudinary, master_products

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Meenicode Backend")

# CORS setup
origins = [
    "http://localhost:8081",
    "http://meenicode-frontend.s3-website.ap-south-1.amazonaws.com",
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(shop_onboarding.router, prefix="/shops", tags=["Shops"])
app.include_router(customers.router, prefix="/customers", tags=["Customers"])
app.include_router(cloudinary.router)
app.include_router(master_products.router)
#app.include_router(sales.router, prefix="/sales", tags=["Sales"])

handler = Mangum(app)
