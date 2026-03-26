from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.document import OcrResponse
from app.services.document_service import extract_text_ocr

router = APIRouter()


@router.post("/ocr", response_model=OcrResponse)
async def ocr(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    try:
        result = extract_text_ocr(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")
    return OcrResponse(**result)
