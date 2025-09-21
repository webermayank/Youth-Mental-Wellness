# train_safety_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import joblib
import os

DATA_CSV = "affirmations.csv"  # adjust path
OUT_MODEL = os.getenv("SAFETY_MODEL_PATH", "safety_model.joblib")

def load_data(path):
    df = pd.read_csv(path, engine="python")
    # Expect columns: text, safety_flag (safe|flag)
    df = df.dropna(subset=["text"])
    if "safety_flag" not in df.columns:
        raise ValueError("CSV must contain 'safety_flag' column with 'safe' or 'flag'")
    df['label'] = df['safety_flag'].apply(lambda x: 'flag' if str(x).lower().strip() in ['flag','unsafe','1','true'] else 'safe')
    return df

def train():
    df = load_data(DATA_CSV)
    X = df['text'].astype(str).tolist()
    y = df['label'].tolist()
    pipe = make_pipeline(TfidfVectorizer(ngram_range=(1,2), max_features=20000), LogisticRegression(class_weight='balanced', max_iter=1000))
    pipe.fit(X, y)
    joblib.dump(pipe, OUT_MODEL)
    print("Saved safety model to", OUT_MODEL)
    print("Classes:", pipe.classes_)

if __name__ == "__main__":
    train()
