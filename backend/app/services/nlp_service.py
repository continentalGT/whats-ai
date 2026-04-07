from transformers import pipeline
from app.core.config import settings
from typing import List, Optional
import numpy as np
import requests as http_requests

_sentiment_pipeline = None


def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=settings.sentiment_model
        )
    return _sentiment_pipeline


def _get_embeddings(texts: List[str]) -> List[List[float]]:
    endpoint = settings.azure_openai_endpoint.rstrip("/")
    deployment = settings.azure_openai_embedding_deployment
    url = f"{endpoint}/openai/deployments/{deployment}/embeddings?api-version=2024-02-01"
    headers = {
        "Content-Type": "application/json",
        "api-key": settings.azure_openai_key,
    }
    resp = http_requests.post(url, headers=headers, json={"input": texts}, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return [item["embedding"] for item in sorted(data["data"], key=lambda x: x["index"])]


def _cosine_similarity(a: List[float], b: List[float]) -> float:
    a_arr = np.array(a)
    b_arr = np.array(b)
    return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))


def compute_similarity(sentences: List[str], query: str) -> dict:
    all_texts = [query] + sentences
    embeddings = _get_embeddings(all_texts)
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


_TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com"

_TRANSLITERATION_CONFIG = {
    'ar':      ('Arab', 'Latn'),
    'hi':      ('Deva', 'Latn'),
    'ja':      ('Jpan', 'Latn'),
    'zh-Hans': ('Hans', 'Latn'),
    'ko':      ('Kore', 'Latn'),
    'ru':      ('Cyrl', 'Latn'),
    'uk':      ('Cyrl', 'Latn'),
    'el':      ('Grek', 'Latn'),
    'th':      ('Thai', 'Latn'),
}

_LANGUAGE_NAMES = {
    'en': 'English',    'es': 'Spanish',    'fr': 'French',
    'de': 'German',     'it': 'Italian',    'pt': 'Portuguese',
    'nl': 'Dutch',      'tr': 'Turkish',    'pl': 'Polish',
    'sv': 'Swedish',    'vi': 'Vietnamese', 'id': 'Indonesian',
    'ru': 'Russian',    'uk': 'Ukrainian',  'ar': 'Arabic',
    'hi': 'Hindi',      'ja': 'Japanese',   'zh-Hans': 'Chinese',
    'zh': 'Chinese',    'ko': 'Korean',     'el': 'Greek',
    'th': 'Thai',
}


def _translator_headers() -> dict:
    return {
        'Ocp-Apim-Subscription-Key': settings.azure_multiservice_key,
        'Ocp-Apim-Subscription-Region': settings.azure_multiservice_region,
        'Content-Type': 'application/json',
    }


def translate_text(text: str, target_lang: str) -> dict:
    headers = _translator_headers()

    # Step 1: Translate + auto-detect source language
    resp = http_requests.post(
        f"{_TRANSLATOR_ENDPOINT}/translate",
        params={'api-version': '3.0', 'to': target_lang},
        headers=headers,
        json=[{'text': text}],
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()[0]

    detected_code = data['detectedLanguage']['language']
    detected_score = round(data['detectedLanguage']['score'], 2)
    translated = data['translations'][0]['text']

    # Step 2: Transliterate if target script is non-Latin
    transliteration: Optional[str] = None
    if target_lang in _TRANSLITERATION_CONFIG:
        from_script, to_script = _TRANSLITERATION_CONFIG[target_lang]
        tr_resp = http_requests.post(
            f"{_TRANSLATOR_ENDPOINT}/transliterate",
            params={
                'api-version': '3.0',
                'language': target_lang,
                'fromScript': from_script,
                'toScript': to_script,
            },
            headers=headers,
            json=[{'text': translated}],
            timeout=10,
        )
        if tr_resp.status_code == 200:
            transliteration = tr_resp.json()[0]['text']

    return {
        'original_text': text,
        'detected_language_code': detected_code,
        'detected_language_name': _LANGUAGE_NAMES.get(detected_code, detected_code.upper()),
        'detected_confidence': detected_score,
        'target_language': target_lang,
        'translated_text': translated,
        'transliteration': transliteration,
        'word_count': len(text.split()),
    }


def predict_sentiment(text: str) -> dict:
    model = get_sentiment_pipeline()
    result = model(text)[0]
    return {
        "label": result["label"],
        "score": round(result["score"], 4),
        "model": settings.sentiment_model,
    }
