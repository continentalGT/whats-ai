from transformers import pipeline
from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential
from app.core.config import settings
from typing import List
import numpy as np

_sentiment_pipeline = None
_embeddings_client = None


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=settings.sentiment_model
        )
    return _sentiment_pipeline


def get_embeddings_client() -> EmbeddingsClient:
    global _embeddings_client
    if _embeddings_client is None:
        endpoint = settings.azure_openai_endpoint.rstrip("/")
        deployment = settings.azure_openai_embedding_deployment
        _embeddings_client = EmbeddingsClient(
            endpoint=f"{endpoint}/openai/deployments/{deployment}",
            credential=AzureKeyCredential(settings.azure_openai_key),
        )
    return _embeddings_client


def _cosine_similarity(a: List[float], b: List[float]) -> float:
    a_arr = np.array(a)
    b_arr = np.array(b)
    return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))


def compute_similarity(sentences: List[str], query: str) -> dict:
    client = get_embeddings_client()
    all_texts = [query] + sentences
    response = client.embed(input=all_texts)

    embeddings = [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
    query_embedding = embeddings[0]
    sentence_embeddings = embeddings[1:]

    results = [
        {"sentence": s, "score": round(_cosine_similarity(query_embedding, sentence_embeddings[i]), 4)}
        for i, s in enumerate(sentences)
    ]
    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "query": query,
        "results": results,
        "model": f"azure-foundry/{settings.azure_openai_embedding_deployment}",
    }


def predict_sentiment(text: str) -> dict:
    model = get_sentiment_pipeline()
    result = model(text)[0]
    return {
        "label": result["label"],
        "score": round(result["score"], 4),
        "model": settings.sentiment_model,
    }
