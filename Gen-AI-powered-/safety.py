# safety.py
import re
from typing import Tuple
import joblib
import os

# urgent regex - robust patterns
URGENT_PATTERNS = [
    r"\bkill myself\b",
    r"\bkill me\b",
    r"\bi want to die\b",
    r"\bi'm going to kill myself\b",
    r"\bwant to end my life\b",
    r"\bsuicid\w*\b",
    r"\bhurt myself\b",
    r"\bending my life\b",
    r"\bwant to die\b"
]
URGENT_REGEX = re.compile("|".join(URGENT_PATTERNS), flags=re.IGNORECASE)

def detect_urgent(text: str) -> bool:
    if not text:
        return False
    return bool(URGENT_REGEX.search(text))

# ---- model wrapper ----
# we will save a scikit-learn model as safety_model.joblib
MODEL_PATH = os.getenv("SAFETY_MODEL_PATH", "safety_model.joblib")

def load_safety_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None

def predict_safety(text: str, model) -> Tuple[str, float]:
    """
    Returns (label, score) where label in {'safe','flag'}.
    If model is None, returns ('unknown', 0.0)
    """
    if model is None:
        return ("unknown", 0.0)
    X = [text]
    proba = model.predict_proba(X)[0]  # assume columns [safe, flag] or [flag, safe] - check order
    # We'll assume model.classes_ gives labels
    # find index for 'flag'
    classes = model.classes_
    score_flag = 0.0
    for cls, p in zip(classes, proba):
        if str(cls).lower() in ("flag","unsafe","1","true"):
            score_flag = p
    # Decide threshold
    if score_flag >= 0.5:
        return ("flag", float(score_flag))
    else:
        return ("safe", float(score_flag))
