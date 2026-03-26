from transformers import pipeline, BlipProcessor, BlipForConditionalGeneration
from app.core.config import settings
from PIL import Image, ImageDraw
import base64
from io import BytesIO

_detection_pipeline = None
_blip_processor = None
_blip_model = None
_classification_pipeline = None

COLORS = [
    "#CC1111", "#0D7377", "#0055AA", "#228833", "#BB8800",
    "#881199", "#116644", "#997700", "#551199", "#004488",
]


def get_detection_pipeline():
    global _detection_pipeline
    if _detection_pipeline is None:
        _detection_pipeline = pipeline(
            "object-detection",
            model=settings.detection_model
        )
    return _detection_pipeline


def get_blip_model():
    global _blip_processor, _blip_model
    if _blip_processor is None:
        _blip_processor = BlipProcessor.from_pretrained(settings.captioning_model)
    if _blip_model is None:
        _blip_model = BlipForConditionalGeneration.from_pretrained(settings.captioning_model)
    return _blip_processor, _blip_model


def get_classification_pipeline():
    global _classification_pipeline
    if _classification_pipeline is None:
        _classification_pipeline = pipeline(
            "image-classification",
            model=settings.classification_model,
        )
    return _classification_pipeline


def classify_image(image: Image.Image, top_k: int = 5) -> dict:
    model = get_classification_pipeline()
    results = model(image.convert("RGB"), top_k=top_k)
    predictions = [
        {"label": r["label"].replace("_", " ").title(), "score": round(r["score"], 4)}
        for r in results
    ]
    return {
        "predictions": predictions,
        "model": settings.classification_model,
        "total_classes": 1000,
    }


def caption_image(image: Image.Image) -> dict:
    processor, model = get_blip_model()
    inputs = processor(image.convert("RGB"), return_tensors="pt")
    output = model.generate(**inputs, max_new_tokens=50)
    caption = processor.decode(output[0], skip_special_tokens=True)
    return {
        "caption": caption,
        "model": settings.captioning_model,
    }


def detect_objects(image: Image.Image, threshold: float = 0.9) -> dict:
    model = get_detection_pipeline()
    results = model(image, threshold=threshold)

    annotated = image.copy().convert("RGB")
    draw = ImageDraw.Draw(annotated)

    for i, det in enumerate(results):
        color = COLORS[i % len(COLORS)]
        box = det["box"]
        label = f"{det['label']} {det['score']:.0%}"

        # Black outline for contrast, then colored box on top
        draw.rectangle(
            [(box["xmin"] - 1, box["ymin"] - 1), (box["xmax"] + 1, box["ymax"] + 1)],
            outline="#000000",
            width=5,
        )
        draw.rectangle(
            [(box["xmin"], box["ymin"]), (box["xmax"], box["ymax"])],
            outline=color,
            width=3,
        )
        # Label with black background
        text_pos = (box["xmin"] + 4, box["ymin"] + 4)
        text_bbox = draw.textbbox(text_pos, label)
        draw.rectangle(
            [text_bbox[0] - 2, text_bbox[1] - 1, text_bbox[2] + 2, text_bbox[3] + 1],
            fill="#000000",
        )
        draw.text(text_pos, label, fill=color)

    buffer = BytesIO()
    annotated.save(buffer, format="PNG")
    img_b64 = base64.b64encode(buffer.getvalue()).decode()

    detections = [
        {
            "label": d["label"],
            "score": round(d["score"], 4),
            "box": d["box"],
        }
        for d in results
    ]

    return {
        "detections": detections,
        "count": len(detections),
        "model": settings.detection_model,
        "annotated_image": f"data:image/png;base64,{img_b64}",
    }
