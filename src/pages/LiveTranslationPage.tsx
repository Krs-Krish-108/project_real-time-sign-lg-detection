import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Hand,
  MicOff,
  Volume2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Zap,
  Brain,
  Eye,
  WifiOff,
  BarChart2,
} from 'lucide-react';
import { predictSign, clearHistory, type TopPrediction, type Landmark } from '../services/api';

// ── MediaPipe hand skeleton connections (index pairs into the 21-point array) ──
const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm knuckle cross-bar
  [5, 9], [9, 13], [13, 17],
];

export default function LiveTranslationPage() {
  const [active, setActive] = useState(false);
  const [currentSign, setCurrentSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [word, setWord] = useState('');
  const [voiceActive, setVoiceActive] = useState(true);
  const [handDetected, setHandDetected] = useState(false);
  const [apiError, setApiError] = useState(false);       // backend unreachable
  const [cameraError, setCameraError] = useState(false); // webcam permission denied
  const [topPredictions, setTopPredictions] = useState<TopPrediction[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);          // hidden capture canvas
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);   // visible landmark overlay
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpokenRef = useRef<string>('');

  // ── Backend health check on mount ─────────────────────────────────────────
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        if (!res.ok) throw new Error('Non-OK response');
        setApiError(false);
      } catch {
        setApiError(true);
      }
    };
    checkBackend();
  }, []);

  // ── Webcam helpers ─────────────────────────────────────────────────────────
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraError(false);
    } catch (err) {
      console.error('Webcam access error:', err);
      setCameraError(true);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clear landmark overlay when camera stops
    const oc = overlayCanvasRef.current;
    if (oc) {
      const ctx = oc.getContext('2d');
      ctx?.clearRect(0, 0, oc.width, oc.height);
    }
  }, []);

  // ── Draw MediaPipe hand skeleton on the overlay canvas ──────────────────────
  const drawHandLandmarks = useCallback((pts: Landmark[], w: number, h: number) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    if (pts.length !== 21) return;

    // ── Draw connections (bones) ───────────────────────────────────────────────
    HAND_CONNECTIONS.forEach(([a, b]) => {
      const ax = pts[a].x * w;
      const ay = pts[a].y * h;
      const bx = pts[b].x * w;
      const by = pts[b].y * h;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      // Thumb + palm = cyan; fingers = indigo
      const isPalmOrThumb = (a <= 4 || b <= 4) || (a === 5 && b === 9) || (a === 9 && b === 13) || (a === 13 && b === 17);
      ctx.strokeStyle = isPalmOrThumb ? 'rgba(34,211,238,0.85)' : 'rgba(129,140,248,0.85)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // ── Draw landmark dots ─────────────────────────────────────────────────────
    pts.forEach((lm, i) => {
      const px = lm.x * w;
      const py = lm.y * h;
      // Larger radius for fingertips (4,8,12,16,20) and wrist (0)
      const isTip = [0, 4, 8, 12, 16, 20].includes(i);
      const r = isTip ? 7 : 4.5;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(px, py, r + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fill();

      // Filled dot
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      if (i === 0) {
        ctx.fillStyle = '#f472b6';   // wrist  → pink
      } else if (i <= 4) {
        ctx.fillStyle = '#22d3ee';   // thumb  → cyan
      } else if (i <= 8) {
        ctx.fillStyle = '#818cf8';   // index  → indigo
      } else if (i <= 12) {
        ctx.fillStyle = '#34d399';   // middle → emerald
      } else if (i <= 16) {
        ctx.fillStyle = '#fbbf24';   // ring   → amber
      } else {
        ctx.fillStyle = '#f87171';   // pinky  → red
      }
      ctx.fill();

      // White centre highlight
      ctx.beginPath();
      ctx.arc(px, py, r * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fill();
    });
  }, []);

  // ── Capture frame → POST to /api/predict ──────────────────────────────────
  const captureAndPredict = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.7);

    try {
      const result = await predictSign(base64);
      setCurrentSign(result.letter);
      setConfidence(result.confidence);
      setWord(result.word ?? '');
      setHandDetected(result.hand_detected);
      setTopPredictions(result.all_predictions ?? []);
      setLandmarks(result.landmarks ?? []);
      setApiError(false);

      // Draw or clear landmark overlay
      if (result.landmarks && result.landmarks.length === 21) {
        drawHandLandmarks(result.landmarks, video.videoWidth, video.videoHeight);
      } else {
        const oc = overlayCanvasRef.current;
        if (oc) oc.getContext('2d')?.clearRect(0, 0, oc.width, oc.height);
      }

      // Web Speech API — read letter aloud once per new detection
      if (voiceActive && result.letter && result.letter !== lastSpokenRef.current) {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(result.letter);
          utter.rate = 1.1;
          window.speechSynthesis.speak(utter);
          lastSpokenRef.current = result.letter;
        }
      }
    } catch (err) {
      console.error('Predict API error:', err);
      setApiError(true);
      setCameraError(false);
      // Clear overlay on error
      const oc = overlayCanvasRef.current;
      if (oc) oc.getContext('2d')?.clearRect(0, 0, oc.width, oc.height);
    }
  }, [voiceActive, drawHandLandmarks]);

  // ── Start / Stop effect ────────────────────────────────────────────────────
  useEffect(() => {
    if (active) {
      startWebcam().then(() => {
        intervalRef.current = setInterval(captureAndPredict, 200);
      });
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopWebcam();
      setCurrentSign(null);
      setConfidence(0);
      setHandDetected(false);
      setTopPredictions([]);
      setLandmarks([]);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, startWebcam, stopWebcam, captureAndPredict]);

  // ── Clear word buffer ──────────────────────────────────────────────────────
  const handleClearWord = async () => {
    await clearHistory();
    setWord('');
    setCurrentSign(null);
    lastSpokenRef.current = '';
  };

  // ── Confidence colour helper ───────────────────────────────────────────────
  const confColor =
    confidence >= 85
      ? 'text-green-600 dark:text-green-400'
      : confidence >= 70
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400';

  const confBarClass =
    confidence >= 85
      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
      : confidence >= 70
      ? 'bg-gradient-to-r from-amber-500 to-orange-400'
      : 'bg-gradient-to-r from-red-500 to-rose-400';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Translation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Real-time ASL sign language detection · powered by MediaPipe + Keras
        </p>
      </div>

      {/* Backend error banner */}
      {apiError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <WifiOff size={16} className="flex-shrink-0" />
          <span>
            Backend unreachable. Run{' '}
            <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1.5 rounded">
              python app.py
            </code>{' '}
            in your project folder, then try again.
          </span>
        </div>
      )}

      {/* Camera error banner */}
      {cameraError && !apiError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          <WifiOff size={16} className="flex-shrink-0" />
          <span>
            Camera access denied. Please allow camera permissions in your browser and try again.
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── Left: Camera feed ───────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Camera frame */}
          <div className="camera-frame aspect-video relative overflow-hidden flex items-center justify-center">
            {/* HUD — top left */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 z-10">
              <Camera className="text-white" size={14} />
              <span className="text-white text-xs font-medium">Camera Feed</span>
            </div>

            {/* HUD — top right (live indicator) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-green-400 text-xs font-medium bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                {active ? 'LIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Real webcam video */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${active ? 'block' : 'hidden'}`}
              muted
              playsInline
            />
            {/* Hidden canvas for frame capture only */}
            <canvas ref={canvasRef} className="hidden" />
            {/* Visible landmark skeleton overlay — pointer-events:none so clicks pass through */}
            <canvas
              ref={overlayCanvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none ${active ? 'block' : 'hidden'}`}
              style={{ objectFit: 'cover' }}
            />

            {/* Overlay: detected letter badge on video */}
            {active && currentSign && (
              <div className="absolute top-16 left-4 z-10 bg-black/60 backdrop-blur-sm border border-indigo-400/50 rounded-2xl px-5 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Detected</p>
                <p className="text-6xl font-black text-indigo-300 leading-none">{currentSign}</p>
              </div>
            )}

            {/* Overlay: no hand prompt */}
            {active && !handDetected && !apiError && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-5 text-center border border-white/10">
                  <Hand className="text-indigo-400/60 mx-auto mb-2 animate-pulse" size={40} />
                  <p className="text-gray-300 text-sm font-medium">Show your hand to the camera</p>
                </div>
              </div>
            )}

            {/* Idle placeholder */}
            {!active && (
              <div className="text-center z-10">
                <Camera className="text-gray-500 mb-3 mx-auto" size={48} />
                <p className="text-gray-400 text-sm">Click "Start Translation" to begin</p>
              </div>
            )}

            {/* HUD — bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Zap size={14} className="text-amber-400" />
                <span className="text-white text-xs">AI Model Active</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Eye size={14} className="text-blue-400" />
                <span className="text-white text-xs">Hand Tracking: {active ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          {/* Word buffer display */}
          {(word || active) && (
            <div className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  Word Buffer
                </p>
                <p
                  className={`text-2xl font-bold tracking-[0.2em] transition-all duration-300 ${
                    word ? 'gradient-text' : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  {word || '—'}
                </p>
              </div>
              {word && (
                <button
                  onClick={handleClearWord}
                  className="ml-4 text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActive(!active)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                active
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'gradient-bg text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
              }`}
            >
              {active ? (
                <><AlertCircle size={18} /> Stop Translation</>
              ) : (
                <><Hand size={18} /> Start Translation</>
              )}
            </button>
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              title={voiceActive ? 'Mute voice output' : 'Enable voice output'}
              className={`p-3 rounded-xl transition-all duration-200 ${
                voiceActive
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}
            >
              {voiceActive ? <Volume2 size={20} /> : <MicOff size={20} />}
            </button>
          </div>
        </div>

        {/* ── Right: AI panel ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Detected sign */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-indigo-600 dark:text-indigo-400" size={18} />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                AI Detection
              </h3>
            </div>
            <div className="text-center py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Detected Sign</p>
              <p
                className={`text-6xl font-extrabold transition-all duration-300 ${
                  active && currentSign ? 'gradient-text' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                {active && currentSign ? currentSign : '—'}
              </p>
              {active && !currentSign && handDetected && (
                <p className="text-xs text-gray-400 mt-2">Low confidence — keep hand steady</p>
              )}
            </div>
          </div>

          {/* Confidence bar */}
          <div className="glass-card rounded-2xl p-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-widest">
              Confidence
            </p>
            <div className="flex items-center gap-3 mb-3">
              <p className={`text-2xl font-bold ${active && currentSign ? confColor : 'text-gray-300 dark:text-gray-600'}`}>
                {active && currentSign ? `${confidence}%` : '—'}
              </p>
              {confidence >= 85 && active && currentSign && (
                <CheckCircle2 className="text-green-500" size={20} />
              )}
            </div>
            <div className="progress-bar">
              <div
                className={`progress-bar-fill ${confBarClass}`}
                style={{ width: active && currentSign ? `${confidence}%` : '0%' }}
              />
            </div>
          </div>

          {/* Top-5 predictions from model */}
          {active && topPredictions.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-indigo-600 dark:text-indigo-400" size={16} />
                <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-widest">
                  Top Predictions
                </p>
              </div>
              <div className="space-y-3">
                {topPredictions.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold w-8 text-center rounded-lg py-0.5 ${
                        i === 0
                          ? 'gradient-text'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {p.class}
                    </span>
                    <div className="flex-1 progress-bar">
                      <div
                        className={`progress-bar-fill ${
                          i === 0
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ width: `${p.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right tabular-nums">
                      {p.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status indicators */}
          <div className="glass-card rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div
                  className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${
                    active ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Camera</p>
              </div>
              <div>
                <div
                  className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${
                    active && !apiError
                      ? 'bg-blue-500 animate-pulse'
                      : apiError
                      ? 'bg-red-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">AI Model</p>
              </div>
              <div>
                <div
                  className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${
                    voiceActive && active
                      ? 'bg-purple-500 animate-pulse'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Voice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
