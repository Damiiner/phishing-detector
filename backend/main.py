import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow import keras

from preprocess import normalize, encode

with open("config.json") as f:
    config = json.load(f)

THRESHOLD = config["threshold"]
model = keras.models.load_model("phishing_char_model.keras")

app = FastAPI(title="Phishing URL Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class UrlRequest(BaseModel):
    url: str


@app.get("/")
def home():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: UrlRequest):
    cleaned = normalize(req.url)
    prob = float(model.predict(encode([cleaned]), verbose=0)[0][0])
    return {
        "url": req.url,
        "probability": round(prob, 3),
        "label": "phishing" if prob >= THRESHOLD else "legitimate",
        "threshold": THRESHOLD,
    }