from transformers import pipeline  
from .preprocess import clean_text  

_classifier = None  

def get_classifier():  
    global _classifier  
    if _classifier is None:  
        model_name = "cardiffnlp/twitter-xlm-roberta-base-sentiment"  
        # top_k=None => връща всички класове (и е съвместимо с нови версии)
        _classifier = pipeline(
            task="sentiment-analysis",
            model=model_name,
            tokenizer=model_name,
            top_k=None
        )
    return _classifier


def _map_label_to_sentiment(label: str) -> str:
    l = label.upper().strip()
    if l == "LABEL_0":
        return "negative"
    if l == "LABEL_1":
        return "neutral"
    if l == "LABEL_2":
        return "positive"

    low = label.lower()
    if "neg" in low:
        return "negative"
    if "neu" in low:
        return "neutral"
    if "pos" in low:
        return "positive"
    return "neutral"


def predict_sentiment(text: str, neutral_threshold: float = 0.60) -> dict:
    cleaned = clean_text(text)
    if not cleaned:
        return {
            "sentiment": "neutral",
            "scores": {"positive": 0.0, "neutral": 1.0, "negative": 0.0},
            "clean_text": cleaned,
        }

    clf = get_classifier()

    out = clf(cleaned)

    # out може да е:
    # 1) list[dict] (ако top_k е число)
    # 2) list[list[dict]] (ако top_k=None -> всички класове)
    if isinstance(out, list) and len(out) > 0 and isinstance(out[0], list):
        raw = out[0]
    elif isinstance(out, list):
        raw = out
    else:
        raw = []

    scores = {"positive": 0.0, "neutral": 0.0, "negative": 0.0}
    for item in raw:
        # item трябва да е dict: {'label': 'LABEL_2', 'score': 0.9}
        if not isinstance(item, dict):
            continue
        s = _map_label_to_sentiment(item.get("label", ""))
        scores[s] = float(item.get("score", 0.0))

    best_label = max(scores, key=scores.get)
    best_score = scores[best_label]

    sentiment = "neutral" if best_score < neutral_threshold else best_label

    return {"sentiment": sentiment, "scores": scores, "clean_text": cleaned}