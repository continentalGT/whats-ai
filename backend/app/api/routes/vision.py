from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.vision import ObjectDetectionResponse, ImageCaptioningResponse
from app.services.vision_service import detect_objects, caption_image
from PIL import Image
from io import BytesIO

router = APIRouter()


@router.post("/detect", response_model=ObjectDetectionResponse)
async def object_detection(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    try:
        image = Image.open(BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")
    try:
        result = detect_objects(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")
    return ObjectDetectionResponse(**result)


@router.post("/caption", response_model=ImageCaptioningResponse)
async def image_captioning(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    try:
        image = Image.open(BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")
    try:
        result = caption_image(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Captioning failed: {str(e)}")
    return ImageCaptioningResponse(**result)
