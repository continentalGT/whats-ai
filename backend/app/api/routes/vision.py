from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.vision import ObjectDetectionResponse
from app.services.vision_service import detect_objects
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
    result = detect_objects(image)
    return ObjectDetectionResponse(**result)
