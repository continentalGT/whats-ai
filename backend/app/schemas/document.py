from pydantic import BaseModel
from typing import List, Optional


class BoundingPoint(BaseModel):
    x: float
    y: float


class OcrLine(BaseModel):
    text: str
    confidence: Optional[float]
    bounding_polygon: List[BoundingPoint]


class OcrBlock(BaseModel):
    lines: List[OcrLine]


class OcrResponse(BaseModel):
    full_text: str
    blocks: List[OcrBlock]
    line_count: int
    word_count: int
    model: str
