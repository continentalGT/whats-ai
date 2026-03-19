from transformers import pipeline
from app.core.config import settings

_sentiment_pipeline = None


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=settings.sentiment_model
        )
    return _sentiment_pipeline


def predict_sentiment(text: str) -> dict:
    model = get_sentiment_pipeline()
    result = model(text)[0]
    return {
        "label": result["label"],
        "score": round(result["score"], 4),
        "model": settings.sentiment_model
    }
