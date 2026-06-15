FROM python:3.11-slim

# ── Install system libraries required by MediaPipe (OpenGL ES) & OpenCV ──
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libegl1 \
    libgles2 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# ── Set working directory ──
WORKDIR /app

# ── Install Python dependencies ──
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Copy application code and model files ──
COPY . .

# ── Expose port (Render injects $PORT at runtime, default to 10000) ──
EXPOSE 10000

# ── Start the server ──
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-10000}"]
