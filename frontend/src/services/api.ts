// =============================================================================
// API Service — Sign Language Recognition Backend
// In production, set VITE_API_URL to your Render backend URL.
// In development, defaults to http://localhost:8000
// =============================================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TopPrediction {
  class: string;
  confidence: number;
}

/** Normalized (0-1) hand landmark point returned by MediaPipe on the backend. */
export interface Landmark {
  x: number; // 0 = left edge, 1 = right edge of frame
  y: number; // 0 = top edge,  1 = bottom edge of frame
  z: number; // depth relative to wrist (negative = closer to camera)
}

export interface PredictResult {
  letter: string | null;
  confidence: number;
  word: string;
  hand_detected: boolean;
  all_predictions: TopPrediction[];
  /** 21 MediaPipe hand landmark points (normalized 0-1). Empty when no hand detected. */
  landmarks: Landmark[];
  error?: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  time: string;
  detectedSign: string;
  sentence: string;
  emotion: string;
  language: string;
  confidence: number;
}

export interface HistoryResult {
  history: HistoryItem[];
  total: number;
}

export interface ClassesResult {
  classes: string[];
  count: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/**
 * Send a base64-encoded JPEG frame to the backend for sign detection.
 * Returns detected letter, confidence, accumulated word, top-5 predictions,
 * and 21 normalized hand landmark coordinates for canvas rendering.
 */
export async function predictSign(base64Image: string): Promise<PredictResult> {
  return apiFetch<PredictResult>('/api/predict', {
    method: 'POST',
    body: JSON.stringify({ image: base64Image }),
  });
}

/**
 * Get all ASL class names the model was trained on.
 */
export async function getClasses(): Promise<ClassesResult> {
  return apiFetch<ClassesResult>('/api/classes');
}

/**
 * Get all sign detections logged during this backend session.
 */
export async function getHistory(): Promise<HistoryResult> {
  return apiFetch<HistoryResult>('/api/history');
}

/**
 * Clear session history and reset the word buffer on the backend.
 */
export async function clearHistory(): Promise<void> {
  await apiFetch<unknown>('/api/history', { method: 'DELETE' });
}
