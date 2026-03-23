from pydantic import BaseModel
from typing import List


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
