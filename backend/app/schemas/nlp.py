from pydantic import BaseModel
from typing import List, Optional


class SentimentRequest(BaseModel):
    text: str


class SentimentResponse(BaseModel):
    label: str
    score: float
    model: str


class SimilarityRequest(BaseModel):
    sentences: List[str]
    query: str


class SimilarityResult(BaseModel):
    sentence: str
    score: float


class SimilarityResponse(BaseModel):
    query: str
    results: List[SimilarityResult]
    model: str


class TranslationRequest(BaseModel):
    text: str
    target_lang: str


class TranslationResponse(BaseModel):
    original_text: str
    detected_language_code: str
    detected_language_name: str
    detected_confidence: float
    target_language: str
    translated_text: str
    transliteration: Optional[str]
    word_count: int
