from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
from app.core.config import settings
from typing import List

_sentiment_pipeline = None
_embedding_model = None


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=settings.sentiment_model
        )
    return _sentiment_pipeline


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(settings.embedding_model)
    return _embedding_model


def compute_similarity(sentences: List[str], query: str) -> dict:
    model = get_embedding_model()
    query_embedding = model.encode(query, convert_to_tensor=True)
    sentence_embeddings = model.encode(sentences, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, sentence_embeddings)[0]
    results = [
        {"sentence": s, "score": round(float(scores[i]), 4)}
        for i, s in enumerate(sentences)
    ]
    return {
        "query": query,
        "results": results,
        "model": settings.embedding_model,
    }


def predict_sentiment(text: str) -> dict:
    model = get_sentiment_pipeline()
    result = model(text)[0]
    return {
        "label": result["label"],
        "score": round(result["score"], 4),
        "model": settings.sentiment_model
    }
