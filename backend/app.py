# =============================================================================
# Sign Language Recognition — FastAPI Backend
# Endpoints:
#   GET  /               — health check
#   GET  /api/classes    — all ASL class names from label encoder
#   POST /api/predict    — accepts base64 JPEG frame, returns letter + confidence
#                          also returns normalized 21-landmark coordinates so
#                          the React canvas can draw the hand skeleton overlay
#   GET  /api/history    — returns all logged detections this session
#   DELETE /api/history  — clears history and word buffer
#
# Run: uvicorn app:app --reload --host 0.0.0.0 --port 8000
# =============================================================================

from __future__ import annotations

import base64
import os
import pickle
from datetime import datetime
from typing import Any

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── TFLite Runtime (lightweight — no full TensorFlow needed) ──────────────────
from ai_edge_litert import interpreter as tflite

# ── MediaPipe Tasks API ────────────────────────────────────────────────────────
BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# ── Configuration ──────────────────────────────────────────────────────────────
CONFIDENCE_THRESHOLD: float = 0.70
# Use absolute paths so the server finds the model files regardless of the
# working directory — critical for Render and other cloud deployments.
BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH: str = os.path.join(BASE_DIR, "sign_language_model.tflite")
ENCODER_PATH: str = os.path.join(BASE_DIR, "label_encoder.pkl")
LANDMARKER_PATH: str = os.path.join(BASE_DIR, "hand_landmarker.task")
# How many consecutive identical predictions before appending to word buffer
STABLE_THRESHOLD: int = 5

# ── Load TFLite Model & Label Encoder ─────────────────────────────────────────
print("Loading TFLite model and label encoder...")
interpreter = tflite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print(f"TFLite model loaded — input shape: {input_details[0]['shape']}")

with open(ENCODER_PATH, "rb") as _f:
    label_encoder = pickle.load(_f)

class_names: list[str] = [
    lbl.replace("-samples", "") for lbl in label_encoder.classes_
]
print(f"Ready — {len(class_names)} classes: {class_names}")

# ── Setup MediaPipe HandLandmarker (IMAGE mode = per-frame, synchronous) ───────
_options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=LANDMARKER_PATH),
    running_mode=VisionRunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.5,
    min_hand_presence_confidence=0.5,
    min_tracking_confidence=0.5,
)
detector = HandLandmarker.create_from_options(_options)

# ── In-memory Session State ───────────────────────────────────────────────────
word_buffer: list[str] = []
last_letter: str | None = None
stable_count: int = 0
history: list[dict[str, Any]] = []

# ── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Sign Language Recognition API",
    description="Real-time ASL detection via MediaPipe + TFLite",
    version="2.1.0",
)

# ── CORS Origins ───────────────────────────────────────────────────────────────
# Set ALLOWED_ORIGINS env var on Render as a comma-separated list of allowed
# origins, e.g. "https://your-app.vercel.app"
# Falls back to allow all origins in development.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
_cors_origins: list[str] = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=False,      # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request / Response Models ─────────────────────────────────────────────────
class PredictRequest(BaseModel):
    image: str  # base64-encoded JPEG (with or without data-URI prefix)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health_check() -> dict:
    return {
        "status": "ok",
        "classes": len(class_names),
        "history_count": len(history),
    }


@app.get("/api/classes", tags=["Model"])
def get_classes() -> dict:
    """Return all ASL class names the model was trained on."""
    return {"classes": class_names, "count": len(class_names)}


@app.post("/api/predict", tags=["Model"])
def predict(req: PredictRequest) -> dict:
    """
    Accept a base64-encoded JPEG frame, run MediaPipe + TFLite inference,
    and return the detected letter, confidence, accumulated word, and
    top-5 class probabilities.
    """
    global word_buffer, last_letter, stable_count

    # ── 1. Decode base64 → OpenCV image ───────────────────────────────────────
    try:
        # Strip optional data-URI prefix: "data:image/jpeg;base64,<data>"
        raw_b64 = req.image.split(",")[-1]
        img_bytes = base64.b64decode(raw_b64)
        nparr = np.frombuffer(img_bytes, dtype=np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as exc:
        return {
            "error": f"Image decode failed: {exc}",
            "letter": None,
            "confidence": 0.0,
            "word": "".join(word_buffer),
            "hand_detected": False,
            "all_predictions": [],
            "landmarks": [],
        }

    if frame is None:
        return {
            "letter": None,
            "confidence": 0.0,
            "word": "".join(word_buffer),
            "hand_detected": False,
            "all_predictions": [],
            "landmarks": [],
        }

    # ── 2. MediaPipe hand landmark detection ──────────────────────────────────
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    result = detector.detect(mp_image)

    if not result.hand_landmarks:
        last_letter = None
        stable_count = 0
        return {
            "letter": None,
            "confidence": 0.0,
            "word": "".join(word_buffer),
            "hand_detected": False,
            "all_predictions": [],
            "landmarks": [],
        }

    # ── 3. Extract 63 landmark features & build landmark list for frontend ─────
    hand_lm = result.hand_landmarks[0]  # first detected hand
    coords: list[float] = []
    landmarks: list[dict] = []
    for lm in hand_lm:
        coords.extend([lm.x, lm.y, lm.z])
        # Normalized (0-1) coordinates — frontend scales to canvas pixels
        landmarks.append({"x": lm.x, "y": lm.y, "z": lm.z})

    # ── 4. TFLite model inference ─────────────────────────────────────────────
    input_data = np.asarray([coords], dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])  # shape (1, N)

    predicted_idx = int(np.argmax(prediction))
    confidence = float(prediction[0][predicted_idx])

    # Top-5 predictions (sorted by confidence)
    top5_indices = np.argsort(prediction[0])[::-1][:5]
    top_predictions = [
        {
            "class": class_names[i],
            "confidence": round(float(prediction[0][i]) * 100, 1),
        }
        for i in top5_indices
    ]

    # ── 5. Threshold check & word builder ─────────────────────────────────────
    letter: str | None = None
    if confidence >= CONFIDENCE_THRESHOLD:
        letter = class_names[predicted_idx]

        if letter == last_letter:
            stable_count += 1
            if stable_count == STABLE_THRESHOLD:
                word_buffer.append(letter)
                # Save detection to session history
                now = datetime.now()
                history.append(
                    {
                        "id": len(history) + 1,
                        "date": now.strftime("%Y-%m-%d"),
                        "time": now.strftime("%H:%M"),
                        "detectedSign": letter,
                        "sentence": "".join(word_buffer[-20:]),
                        "emotion": "Neutral",
                        "language": "English",
                        "confidence": round(confidence * 100, 1),
                    }
                )
        else:
            last_letter = letter
            stable_count = 0
    else:
        last_letter = None
        stable_count = 0

    return {
        "letter": letter,
        "confidence": round(confidence * 100, 1),
        "word": "".join(word_buffer[-20:]),
        "hand_detected": True,
        "all_predictions": top_predictions,
        "landmarks": landmarks,   # 21 points [{x, y, z}] — normalized 0-1
    }


@app.get("/api/history", tags=["History"])
def get_history() -> dict:
    """Return all ASL detections logged in this session."""
    return {"history": history, "total": len(history)}


@app.delete("/api/history", tags=["History"])
def clear_history() -> dict:
    """Clear session history and reset the word builder state."""
    global word_buffer, last_letter, stable_count
    history.clear()
    word_buffer.clear()
    last_letter = None
    stable_count = 0
    return {"message": "History and word buffer cleared successfully."}


# ── Entry point (for direct python app.py execution) ──────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)