FROM python:3.11-slim AS builder

# ── Install system libraries required by MediaPipe (OpenGL ES) & OpenCV ──
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libegl1 \
    libgles2 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Install ALL dependencies (including tensorflow for conversion) ──
COPY requirements-build.txt .
RUN pip install --no-cache-dir -r requirements-build.txt

# ── Copy model files and conversion script ──
COPY sign_language_model.keras .
COPY convert_to_tflite.py .

# ── Convert .keras → .tflite during build ──
RUN python convert_to_tflite.py

# ───────────────────────────────────────────────────────────────────────────────
# Stage 2: Lightweight runtime image (no full TensorFlow)
# ───────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libegl1 \
    libgles2 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Install only runtime dependencies (tflite-runtime instead of tensorflow) ──
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application code ──
COPY . .

# ── Copy the converted .tflite model from builder stage ──
COPY --from=builder /app/sign_language_model.tflite ./sign_language_model.tflite

# ── Expose port (Render injects $PORT at runtime, default to 10000) ──
EXPOSE 10000

# ── Start the server ──
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-10000}"]
