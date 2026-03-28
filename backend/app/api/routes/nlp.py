from fastapi import APIRouter, HTTPException
from app.schemas.nlp import (
    SentimentRequest, SentimentResponse,
    SimilarityRequest, SimilarityResponse,
    TranslationRequest, TranslationResponse,
)
from app.services.nlp_service import predict_sentiment, compute_similarity, translate_text

router = APIRouter()


@router.post("/sentiment", response_model=SentimentResponse)
def sentiment_analysis(request: SentimentRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    result = predict_sentiment(request.text)
    return SentimentResponse(**result)


@router.post("/translate", response_model=TranslationResponse)
def translation(request: TranslationRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    word_count = len(text.split())
    if word_count > 20:
        raise HTTPException(status_code=400, detail=f"Input exceeds the 20-word limit ({word_count} words entered)")
    if not request.target_lang.strip():
        raise HTTPException(status_code=400, detail="Target language must be selected")
    try:
        result = translate_text(text, request.target_lang)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
    return TranslationResponse(**result)


@router.post("/similarity", response_model=SimilarityResponse)
def sentence_similarity(request: SimilarityRequest):
    if len(request.sentences) == 0:
        raise HTTPException(status_code=400, detail="Provide at least one sentence")
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query sentence cannot be empty")
    sentences = [s for s in request.sentences if s.strip()]
    if not sentences:
        raise HTTPException(status_code=400, detail="Sentences cannot be empty")
    try:
        result = compute_similarity(sentences, request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity computation failed: {str(e)}")
    return SimilarityResponse(**result)
