from transformers import pipeline

sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)


def predict(text):
    result = sentiment_model(text)[0]
    return result["label"], round(result["score"], 4)


# --- Tests ---

def test_positive_sentiment():
    label, score = predict("I absolutely love this product! It's amazing.")
    assert label == "POSITIVE"
    assert score > 0.9

def test_negative_sentiment():
    label, score = predict("This is the worst experience I've ever had.")
    assert label == "NEGATIVE"
    assert score > 0.9

def test_strong_positive():
    label, score = predict("Fantastic! Best thing ever.")
    assert label == "POSITIVE"

def test_strong_negative():
    label, score = predict("Terrible, I hate it completely.")
    assert label == "NEGATIVE"

def test_returns_label_and_score():
    label, score = predict("It was okay.")
    assert label in ("POSITIVE", "NEGATIVE")
    assert 0.0 < score <= 1.0


if __name__ == "__main__":
    texts = [
        "I love this!",
        "I hate this.",
        "It was okay.",
        "Absolutely fantastic experience.",
        "Worst product ever.",
    ]
    print(f"{'Text':<45} {'Label':<10} {'Score'}")
    print("-" * 65)
    for t in texts:
        label, score = predict(t)
        print(f"{t:<45} {label:<10} {score}")
