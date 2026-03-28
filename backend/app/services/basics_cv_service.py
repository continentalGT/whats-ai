from PIL import Image, ImageFilter
from io import BytesIO
import base64
import numpy as np


def _to_base64(image: Image.Image) -> str:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"


def _thumbnail(image: Image.Image, max_size: int = 800) -> Image.Image:
    img = image.copy()
    img.thumbnail((max_size, max_size), Image.LANCZOS)
    return img


def image_as_array(image: Image.Image) -> dict:
    rgb = image.convert("RGB")
    arr = np.array(rgb)
    h, w, c = arr.shape

    channel_stats = []
    for i, name in enumerate(["R", "G", "B"]):
        ch = arr[:, :, i]
        channel_stats.append({
            "channel": name,
            "min": int(ch.min()),
            "max": int(ch.max()),
            "mean": round(float(ch.mean()), 2),
        })

    # 8x8 representative sample — resize to 8x8 with nearest-neighbor
    small = rgb.resize((8, 8), Image.NEAREST)
    sample_grid = np.array(small).tolist()

    return {
        "width": w,
        "height": h,
        "channels": c,
        "mode": image.mode,
        "total_pixels": w * h,
        "channel_stats": channel_stats,
        "sample_grid": sample_grid,
        "original_image": _to_base64(_thumbnail(rgb)),
    }


def crop_image(image: Image.Image, left: float, top: float, right: float, bottom: float) -> dict:
    rgb = image.convert("RGB")
    w, h = rgb.size

    x1 = int(left / 100 * w)
    y1 = int(top / 100 * h)
    x2 = int(right / 100 * w)
    y2 = int(bottom / 100 * h)

    x1 = max(0, min(x1, w - 1))
    y1 = max(0, min(y1, h - 1))
    x2 = max(x1 + 1, min(x2, w))
    y2 = max(y1 + 1, min(y2, h))

    cropped = rgb.crop((x1, y1, x2, y2))
    cw, ch = cropped.size

    return {
        "original_width": w,
        "original_height": h,
        "crop_x1": x1,
        "crop_y1": y1,
        "crop_x2": x2,
        "crop_y2": y2,
        "cropped_width": cw,
        "cropped_height": ch,
        "original_image": _to_base64(_thumbnail(rgb)),
        "cropped_image": _to_base64(cropped),
    }


def sharpen_image(image: Image.Image, strength: int, method: str) -> dict:
    rgb = image.convert("RGB")
    w, h = rgb.size

    if method == "unsharp_mask":
        radius = strength * 1.5
        percent = 100 + strength * 40
        sharpened = rgb.filter(ImageFilter.UnsharpMask(radius=radius, percent=int(percent), threshold=2))
        label = "Unsharp Mask"
    else:
        sharpened = rgb
        for _ in range(strength):
            sharpened = sharpened.filter(ImageFilter.SHARPEN)
        label = "Sharpen Filter"

    return {
        "original_image": _to_base64(_thumbnail(rgb)),
        "sharpened_image": _to_base64(_thumbnail(sharpened)),
        "method": label,
        "strength": strength,
        "width": w,
        "height": h,
    }


def detect_edges(image: Image.Image, algorithm: str) -> dict:
    rgb = image.convert("RGB")
    w, h = rgb.size

    filter_map = {
        "find_edges": ImageFilter.FIND_EDGES,
        "edge_enhance": ImageFilter.EDGE_ENHANCE,
        "edge_enhance_more": ImageFilter.EDGE_ENHANCE_MORE,
        "emboss": ImageFilter.EMBOSS,
    }
    label_map = {
        "find_edges": "Find Edges",
        "edge_enhance": "Edge Enhance",
        "edge_enhance_more": "Edge Enhance More",
        "emboss": "Emboss",
    }

    pil_filter = filter_map.get(algorithm, ImageFilter.FIND_EDGES)
    edge_img = rgb.filter(pil_filter)

    return {
        "original_image": _to_base64(_thumbnail(rgb)),
        "edge_image": _to_base64(_thumbnail(edge_img)),
        "algorithm": label_map.get(algorithm, algorithm),
        "width": w,
        "height": h,
    }


def blur_image(image: Image.Image, blur_type: str, radius: int) -> dict:
    rgb = image.convert("RGB")
    w, h = rgb.size

    if blur_type == "gaussian":
        blurred = rgb.filter(ImageFilter.GaussianBlur(radius=radius))
        label = "Gaussian Blur"
    elif blur_type == "box":
        blurred = rgb.filter(ImageFilter.BoxBlur(radius=radius))
        label = "Box Blur"
    else:
        size = max(3, radius * 2 + 1)
        if size % 2 == 0:
            size += 1
        blurred = rgb.filter(ImageFilter.MedianFilter(size=size))
        label = "Median Filter"

    return {
        "original_image": _to_base64(_thumbnail(rgb)),
        "blurred_image": _to_base64(_thumbnail(blurred)),
        "blur_type": label,
        "radius": radius,
        "width": w,
        "height": h,
    }
