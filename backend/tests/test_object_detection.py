import requests
from PIL import Image
from io import BytesIO
from transformers import pipeline

object_detection_model = pipeline(
    "object-detection",
    model="facebook/detr-resnet-50"
)

# Public test images with known objects
CAT_IMAGE_URL = "http://images.cocodataset.org/val2017/000000039769.jpg"   # two cats
BUS_IMAGE_URL = "http://images.cocodataset.org/val2017/000000001268.jpg"   # bus / people


def load_image(url: str) -> Image.Image:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return Image.open(BytesIO(response.content)).convert("RGB")


def detect(image: Image.Image, threshold: float = 0.9) -> list[dict]:
    return object_detection_model(image, threshold=threshold)


# --- Tests ---

def test_returns_list_of_detections():
    image = load_image(CAT_IMAGE_URL)
    results = detect(image)
    assert isinstance(results, list)
    assert len(results) > 0


def test_detection_has_required_fields():
    image = load_image(CAT_IMAGE_URL)
    results = detect(image)
    for det in results:
        assert "label" in det
        assert "score" in det
        assert "box" in det
        box = det["box"]
        assert all(k in box for k in ("xmin", "ymin", "xmax", "ymax"))


def test_scores_are_valid_probabilities():
    image = load_image(CAT_IMAGE_URL)
    results = detect(image, threshold=0.5)
    for det in results:
        assert 0.0 < det["score"] <= 1.0


def test_detects_cat():
    image = load_image(CAT_IMAGE_URL)
    results = detect(image, threshold=0.9)
    labels = [det["label"].lower() for det in results]
    assert any("cat" in label for label in labels), f"Expected 'cat' in {labels}"


def test_detects_bus():
    image = load_image(BUS_IMAGE_URL)
    results = detect(image, threshold=0.5)
    labels = [det["label"].lower() for det in results]
    assert any("bus" in label or "person" in label for label in labels), (
        f"Expected 'bus' or 'person' in {labels}"
    )


def test_box_coordinates_are_positive():
    image = load_image(CAT_IMAGE_URL)
    results = detect(image)
    for det in results:
        box = det["box"]
        assert box["xmin"] >= 0
        assert box["ymin"] >= 0
        assert box["xmax"] > box["xmin"]
        assert box["ymax"] > box["ymin"]


if __name__ == "__main__":
    for url, label in [(CAT_IMAGE_URL, "cats"), (BUS_IMAGE_URL, "bus/people")]:
        print(f"\nImage: {label}")
        print("-" * 60)
        image = load_image(url)
        results = detect(image, threshold=0.9)
        print(f"{'Label':<20} {'Score':<8} {'Box'}")
        print("-" * 60)
        for det in results:
            b = det["box"]
            box_str = f"({b['xmin']},{b['ymin']}) -> ({b['xmax']},{b['ymax']})"
            print(f"{det['label']:<20} {det['score']:.4f}   {box_str}")
