from fastapi import APIRouter
from fastapi.responses import JSONResponse
import time, cloudinary, cloudinary.utils

router = APIRouter(
    prefix="/cloudinary",
    tags=["Cloudinary"]
)

cloudinary.config(
    cloud_name="dcra3g9sk",
    api_key="886161733275543",
    api_secret="GJAjOIJCEobqTyvMdCW5XvqVMOc"
)

@router.get("/sign")
async def cloudinary_sign():
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": "meenicode",
        "eager": "e_background_removal"
    }
    signature = cloudinary.utils.api_sign_request(params, cloudinary.config().api_secret)
    return JSONResponse(content={
        "signature": signature,
        "timestamp": timestamp,
        "api_key": cloudinary.config().api_key,
        "cloud_name": cloudinary.config().cloud_name,
        "folder": "meenicode",
        "eager": "e_background_removal"
    })
