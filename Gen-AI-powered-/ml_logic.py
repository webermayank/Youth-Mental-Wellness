# ml_logic.py
"""
Vertex-based ML logic for Youth Wellness app.

Requirements:
  pip install vertexai google-cloud-aiplatform pandas python-dotenv

Behavior:
  - Uses Vertex AI GenerativeModel (Gemini) to classify mood and generate affirmations.
  - Uses local CSVs (moods.csv, affirmations.csv) only as fallback / enrichment.
  - By default WILL FAIL if Vertex cannot be reached (no silent mock).
  - Optional fallback behavior can be enabled by setting ALLOW_FALLBACK=true in .env (for dev).
"""

import os
import sys
import json
import random
import logging
from dotenv import load_dotenv
import pandas as pd
from safety import detect_urgent, load_safety_model, predict_safety, MODEL_PATH


# Vertex imports
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
except Exception as e:
    vertexai = None
    GenerativeModel = None

# Load .env if present
load_dotenv()

safety_model = load_safety_model()


# Config from env
PROJECT_ID = os.getenv("GCP_PROJECT") or os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GCP_LOCATION", "asia-south1")
VERTEX_MODEL_ID = os.getenv("VERTEX_MODEL_ID", "gemini-2.5-flash")
ALLOW_FALLBACK = os.getenv("ALLOW_FALLBACK", "false").lower() == "true"

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml_logic")

# -------------------- Data loading --------------------
def load_csv_safe(path):
    if not os.path.exists(path):
        logger.warning(f"Data file not found: {path}")
        return None
    return pd.read_csv(path, engine="python")

moods_df = load_csv_safe("moods.csv")    # expects columns: mood_label, ...
affirmations_df = load_csv_safe("affirmations.csv")  # expects columns: mood_tag, text, safety_flag (optional)

# minimal check
if moods_df is None or affirmations_df is None:
    logger.warning("One or more CSV data files missing. Affirmation fallback may be limited.")

# normalize/merge if possible
if moods_df is not None and "mood_label" in moods_df.columns and "mood_tag" in affirmations_df.columns:
    # create a combined df for fallback lookup
    try:
        full_df = pd.merge(moods_df, affirmations_df, left_on="mood_label", right_on="mood_tag", how="inner")
    except Exception:
        full_df = affirmations_df.copy()
else:
    full_df = affirmations_df.copy() if affirmations_df is not None else None

# -------------------- Vertex init --------------------
_model = None
def init_vertex():
    global _model
    if vertexai is None or GenerativeModel is None:
        raise RuntimeError("vertexai SDK not installed. Install `vertexai` and `google-cloud-aiplatform`.")
    if not PROJECT_ID:
        raise RuntimeError("GCP_PROJECT / GOOGLE_CLOUD_PROJECT env var not set.")
    # initialize Vertex
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    _model = GenerativeModel(VERTEX_MODEL_ID)
    logger.info(f"Vertex initialized (project={PROJECT_ID}, location={LOCATION}, model={VERTEX_MODEL_ID})")

# safe extractor for vertex responses (may vary by SDK version)
def _extract_text(resp):
    try:
        # many SDKs provide resp.text
        if hasattr(resp, "text") and resp.text:
            return resp.text.strip()
    except Exception:
        pass
    try:
        if hasattr(resp, "response") and getattr(resp.response, "candidates", None):
            cand = resp.response.candidates[0]
            # candidate content parts
            if getattr(cand, "content", None) and getattr(cand.content, "parts", None):
                part = cand.content.parts[0]
                # part may have .text or .content
                if hasattr(part, "text"):
                    return part.text.strip()
    except Exception:
        pass
    # fallback: try string conversion
    try:
        s = str(resp)
        if len(s) < 10000:
            return s.strip()
    except Exception:
        pass
    return None

# -------------------- Safety detection --------------------
URGENT_KEYWORDS = ["suicide", "kill myself", "hurt myself", "want to die", "end my life", "die by suicide"]
def detect_urgent(text: str) -> bool:
    if not text:
        return False
    t = text.lower()
    return any(k in t for k in URGENT_KEYWORDS)

# -------------------- Core functions --------------------
def classify_mood(user_text: str) -> str:
    """
    Use Vertex to classify into one of: Happy, Sad, Anxious, Angry, Fearful, Urgent, Neutral
    Raises RuntimeError if Vertex not available and ALLOW_FALLBACK=False
    """
    buckets = ["Happy", "Sad", "Anxious", "Angry", "Fearful", "Urgent", "Neutral"]
    if not user_text or not user_text.strip():
        return "Neutral"
    # If urgent, return Urgent
    if detect_urgent(user_text):
        return "Urgent"

     # 2) Safety classifier pre-check (if available)
    if safety_model is not None:
        label, score = predict_safety(user_text, safety_model)
        # if classifier thinks it's flagged (score high) treat as Urgent/flag
        if label == "flag" and score >= 0.5:
            return "Urgent"

    # If Vertex available, call it
    if _model is not None:
        prompt = (
            "You are an empathetic classifier. Classify the user's text into ONE of: "
            + ", ".join(buckets)
            + ". Return only the single category name (no additional text).\n\n"
            f"User text: \"{user_text}\"\nCategory:"
        )
        try:
            resp = _model.generate_content(prompt)
            text = _extract_text(resp)
            if text:
                # sanitize: first non-empty token which matches a bucket
                for line in text.splitlines():
                    for b in buckets:
                        if b.lower() == line.strip().lower() or b.lower() in line.strip().lower():
                            return b
                # fallback: try to see if any bucket appears in text
                for b in buckets:
                    if b.lower() in text.lower():
                        return b
        except Exception as e:
            logger.error("Vertex classify error: %s", e)
            if not ALLOW_FALLBACK:
                raise

    # fallback local heuristics (only if ALLOW_FALLBACK true)
    if ALLOW_FALLBACK:
        t = user_text.lower()
        if any(k in t for k in ["stress", "stressed", "anxiet", "panic", "overwhelm"]):
            return "Anxious"
        if any(k in t for k in ["sad", "depress", "lonely", "gloom"]):
            return "Sad"
        if any(k in t for k in ["happy", "excited", "glad", "joy"]):
            return "Happy"
        if any(k in t for k in ["angry", "mad", "furious"]):
            return "Angry"
        if any(k in t for k in ["fear", "scared", "terrified"]):
            return "Fearful"
        if detect_urgent(t):
            return "Urgent"
        return "Neutral"
    else:
        raise RuntimeError("Vertex classify failed and ALLOW_FALLBACK is false")

def generate_affirmation(user_text: str, mood_bucket: str) -> (str, str):
    """
    Returns (affirmation_text, safety_flag)
    safety_flag = 'flag' if urgent / requires helpline, else 'safe'
    """
    # urgent detection
    if detect_urgent(user_text) or mood_bucket == "Urgent":
        return ("It sounds like you're going through a lot. Please reach out to a trusted person or crisis line right now. You are not alone.", "flag")

    # Try Vertex generation
    if _model is not None:
        prompt = (
            f"You are an empathetic youth support assistant. The user's mood is '{mood_bucket}'. "
            "Create a short positive affirmation tailored to the user's input. Maximum 25 words. "
            "Do NOT provide medical diagnoses or instructions. If the user expresses self-harm, respond with a supportive helpline suggestion instead.\n\n"
            f"User text: \"{user_text}\"\nAffirmation:"
        )
        try:
            resp = _model.generate_content(prompt)
            text = _extract_text(resp)
            if text:
                # trim to single line summary
                first = text.splitlines()[0].strip()
                # small sanity limits
                if len(first.split()) > 60:
                    first = " ".join(first.split()[:60]) + "..."
                return (first, "safe")
        except Exception as e:
            logger.error("Vertex generate_affirmation error: %s", e)
            if not ALLOW_FALLBACK:
                raise

    # Fallback to CSV-based selection if ALLOW_FALLBACK
    if ALLOW_FALLBACK and full_df is not None:
        try:
            # Map mood_bucket to CSV mood_tag format (lowercase)
            mood_mapping = {
                "Happy": "happy",
                "Sad": "sad", 
                "Anxious": "anxious",
                "Angry": "angry",
                "Fearful": "fearful",
                "Urgent": "suicidal",
                "Neutral": "confused"
            }
            csv_mood = mood_mapping.get(mood_bucket, mood_bucket.lower())
            
            rows = full_df[full_df.get("mood_tag", "") == csv_mood]
            if rows is None or len(rows) == 0:
                # Try with original mood_bucket if mapping fails
                rows = full_df[full_df.get("mood_tag", "") == mood_bucket.lower()]
            if rows is None or len(rows) == 0:
                # Fallback to any row
                rows = full_df
            rec = rows.sample(1).iloc[0]
            text = rec.get("text") if "text" in rec else rec.get("affirmation", "Be kind to yourself today.")
            safety_flag = rec.get("safety_flag", "safe")
            # If dataset marks it as urgent flag, override with crisis message
            if safety_flag == "flag":
                text = "It sounds like you're going through a lot. Please reach out to a trusted person or crisis line right now. You are not alone."
            return (str(text).strip(), str(safety_flag))
        except Exception as e:
            logger.error("Fallback affirmation selection error: %s", e)


    # Absolute final fallback
    return ("Thank you for sharing. Remember to be kind to yourself today.", "safe")

def get_playlist_for_mood(mood_bucket: str):
    """
    Pick a playlist (or track) randomly from a list of candidates for each mood.
    """
    mapping = {
        "Happy": [
            "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC",
            "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC"
        ],
        "Sad": [
            "https://open.spotify.com/track/1lDWb6b6ieDQ2xT7ewTC3G",
            "https://open.spotify.com/playlist/37i9dQZF1DWSqBruwoIXjL"
        ],
        "Anxious": [
            "https://open.spotify.com/playlist/37i9dQZF1DWUvQoIOFMFUT",
            "https://open.spotify.com/track/2XWjPtKdi5sucFYtVav07d"
        ],
        "Angry": [
            "https://open.spotify.com/track/2Rk4JlNc2TPmZe2af99d45",
            "https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT"
        ],
        "Fearful": [
            "https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb",
            "https://open.spotify.com/playlist/37i9dQZF1DWZrc3MTCkPzn"
        ],
        "Urgent": [
            "https://open.spotify.com/track/3VlbOrM6nYPprVvzBZllE5"  # calming track
        ],
        "Neutral": [
            "https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg",
            "https://open.spotify.com/track/6QgjcU0zLnzq5OrUoSZ3OK"
        ]
    }
    candidates = mapping.get(mood_bucket, mapping["Neutral"])
    return random.choice(candidates)
# -------------------- Public API --------------------
def analyze_and_respond(user_text: str) -> dict:
    """
    Main wrapper: classify mood, produce affirmation, playlist, and safety flag.
    Returns a dict with keys: mood_bucket, affirmation, safety_flag, playlist_url
    """
    # classify
    mood_bucket = classify_mood(user_text)
    affirmation, safety_flag = generate_affirmation(user_text, mood_bucket)
    playlist = get_playlist_for_mood(mood_bucket)
    return {
        "text": user_text,
        "mood_bucket": mood_bucket,
        "affirmation": affirmation,
        "safety_flag": safety_flag,
        "playlist_url": playlist
    }

# -------------------- CLI entrypoint --------------------
if __name__ == "__main__":
    import sys, json
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
    else:
        input_text = sys.stdin.read().strip()

    try:
        init_vertex()
    except Exception as e:
        if not ALLOW_FALLBACK:
            sys.stdout.write(json.dumps({"error": "vertex_init_failed", "message": str(e)}))
            sys.exit(1)
        else:
            sys.stderr.write(f"WARNING: Vertex init failed, using fallback mode: {e}\n")

    try:
        out = analyze_and_respond(input_text)
        sys.stdout.write(json.dumps(out))
    except Exception as e:
        sys.stderr.write(f"ERROR: {e}\n")
        sys.stdout.write(json.dumps({"error": "internal_error", "message": str(e)}))
        sys.exit(1)
