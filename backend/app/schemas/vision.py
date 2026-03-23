from pydantic import BaseModel
from typing import List


class BoundingBox(BaseModel):
    xmin: int
    ymin: int
    xmax: int
    ymax: int


class Detection(BaseModel):
    label: str
    score: float
    box: BoundingBox


class ObjectDetectionResponse(BaseModel):
    detections: List[Detection]
    count: int
    model: str
    annotated_image: str  # base64-encoded PNG: "data:image/png;base64,..."


class ImageCaptioningResponse(BaseModel):
    caption: str
    model: str
