from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from app.core.config import settings


def extract_text_ocr(image_bytes: bytes) -> dict:
    client = ImageAnalysisClient(
        endpoint=settings.azure_multiservice_endpoint,
        credential=AzureKeyCredential(settings.azure_multiservice_key),
    )

    result = client.analyze(
        image_data=image_bytes,
        visual_features=[VisualFeatures.READ],
    )

    blocks = []
    all_lines = []

    if result.read:
        for block in result.read.blocks:
            lines = []
            for line in block.lines:
                avg_confidence = (
                    round(sum(w.confidence for w in line.words) / len(line.words), 4)
                    if line.words else None
                )
                lines.append({
                    "text": line.text,
                    "confidence": avg_confidence,
                    "bounding_polygon": [{"x": p.x, "y": p.y} for p in line.bounding_polygon],
                })
                all_lines.append(line.text)
            blocks.append({"lines": lines})

    full_text = "\n".join(all_lines)
    word_count = len(full_text.split()) if full_text.strip() else 0

    return {
        "full_text": full_text,
        "blocks": blocks,
        "line_count": len(all_lines),
        "word_count": word_count,
        "model": "Azure AI Vision – Read OCR (v4.0)",
    }
