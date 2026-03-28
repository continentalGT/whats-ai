from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.basics_cv import (
    ImageAsArrayResponse, ImageCroppingResponse,
    ImageSharpeningResponse, EdgeDetectionResponse, ImageBlurringResponse,
)
from app.services.basics_cv_service import (
    image_as_array, crop_image, sharpen_image, detect_edges, blur_image,
)
from PIL import Image
from io import BytesIO

router = APIRouter()


async def _read_image(file: UploadFile) -> Image.Image:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    try:
        return Image.open(BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")


@router.post("/image-as-array", response_model=ImageAsArrayResponse)
async def route_image_as_array(file: UploadFile = File(...)):
    image = await _read_image(file)
    try:
        result = image_as_array(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed: {str(e)}")
    return ImageAsArrayResponse(**result)


@router.post("/crop", response_model=ImageCroppingResponse)
async def route_crop(
    file: UploadFile = File(...),
    left: float = Form(0.0),
    top: float = Form(0.0),
    right: float = Form(100.0),
    bottom: float = Form(100.0),
):
    image = await _read_image(file)
    try:
        result = crop_image(image, left, top, right, bottom)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop failed: {str(e)}")
    return ImageCroppingResponse(**result)


@router.post("/sharpen", response_model=ImageSharpeningResponse)
async def route_sharpen(
    file: UploadFile = File(...),
    strength: int = Form(3),
    method: str = Form("sharpen"),
):
    image = await _read_image(file)
    strength = max(1, min(5, strength))
    try:
        result = sharpen_image(image, strength, method)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sharpen failed: {str(e)}")
    return ImageSharpeningResponse(**result)


@router.post("/edge-detection", response_model=EdgeDetectionResponse)
async def route_edge_detection(
    file: UploadFile = File(...),
    algorithm: str = Form("find_edges"),
):
    image = await _read_image(file)
    try:
        result = detect_edges(image, algorithm)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Edge detection failed: {str(e)}")
    return EdgeDetectionResponse(**result)


@router.post("/blur", response_model=ImageBlurringResponse)
async def route_blur(
    file: UploadFile = File(...),
    blur_type: str = Form("gaussian"),
    radius: int = Form(5),
):
    image = await _read_image(file)
    radius = max(1, min(20, radius))
    try:
        result = blur_image(image, blur_type, radius)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blur failed: {str(e)}")
    return ImageBlurringResponse(**result)
