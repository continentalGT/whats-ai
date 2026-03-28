from pydantic import BaseModel
from typing import List


class ChannelStats(BaseModel):
    channel: str
    min: int
    max: int
    mean: float


class ImageAsArrayResponse(BaseModel):
    width: int
    height: int
    channels: int
    mode: str
    total_pixels: int
    channel_stats: List[ChannelStats]
    sample_grid: List[List[List[int]]]  # 8x8 grid, each cell [R, G, B]
    original_image: str                 # base64 PNG


class ImageCroppingResponse(BaseModel):
    original_width: int
    original_height: int
    crop_x1: int
    crop_y1: int
    crop_x2: int
    crop_y2: int
    cropped_width: int
    cropped_height: int
    original_image: str  # base64 thumbnail
    cropped_image: str   # base64


class ImageSharpeningResponse(BaseModel):
    original_image: str
    sharpened_image: str
    method: str
    strength: int
    width: int
    height: int


class EdgeDetectionResponse(BaseModel):
    original_image: str
    edge_image: str
    algorithm: str
    width: int
    height: int


class ImageBlurringResponse(BaseModel):
    original_image: str
    blurred_image: str
    blur_type: str
    radius: int
    width: int
    height: int
