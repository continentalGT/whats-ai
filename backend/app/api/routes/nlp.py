from fastapi import APIRouter, HTTPException
from app.schemas.nlp import SentimentRequest, SentimentResponse
from app.services.nlp_service import predict_sentiment

router = APIRouter()


@router.post("/sentiment", response_model=SentimentResponse)
def sentiment_analysis(request: SentimentRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    result = predict_sentiment(request.text)
    return SentimentResponse(**result)
