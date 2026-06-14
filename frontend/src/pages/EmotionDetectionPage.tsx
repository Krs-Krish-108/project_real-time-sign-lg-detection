import { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Frown,
  AlertTriangle,
  Angry,
  User,
  Brain,
  Activity,
  Shield,
  Sparkles,
} from 'lucide-react';
import { emotionData } from '../data/mockData';

const emotionIcons: Record<string, typeof Smile> = {
  Happy: Smile,
  Sad: Frown,
  Fear: AlertTriangle,
  Angry: Angry,
  Neutral: User,
};

export default function EmotionDetectionPage() {
  const [active, setActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('Happy');
  const [emotionConfidence, setEmotionConfidence] = useState(92);

  const emotions = ['Happy', 'Sad', 'Neutral', 'Fear', 'Angry'];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const next = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(next);
      setEmotionConfidence(Math.floor(Math.random() * 20) + 75);
    }, 4000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emotion Detection</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time facial emotion analysis and wellness insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="camera-frame aspect-[4/3] flex items-center justify-center relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Activity className="text-blue-400" size={14} />
              <span className="text-white text-xs font-medium">Face Detection</span>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="pulse-dot" />
              <span className="text-green-400 text-xs font-medium bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                {active ? 'ANALYZING' : 'STANDBY'}
              </span>
            </div>

            {active ? (
              <div className="relative">
                <div className="w-48 h-56 rounded-[40%] border-2 border-indigo-400/40 flex items-center justify-center relative">
                  <User className="text-indigo-400/30" size={80} />
                  <div className="absolute top-[35%] left-[30%] w-2 h-2 rounded-full bg-blue-400/60" />
                  <div className="absolute top-[35%] right-[30%] w-2 h-2 rounded-full bg-blue-400/60" />
                  <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-blue-400/40" />
                  <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-8 h-3 rounded-full border border-blue-400/40" />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-indigo-500/80 backdrop-blur-sm px-4 py-1.5 rounded-lg">
                    <span className="text-white text-sm font-semibold">{currentEmotion}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Heart className="text-gray-500 mb-3" size={48} />
                <p className="text-gray-400 text-sm">Click "Start Detection" to begin analysis</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Brain size={14} className="text-purple-400" />
                <span className="text-white text-xs">Emotion AI Active</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Shield size={14} className="text-green-400" />
                <span className="text-white text-xs">Secure Processing</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActive(!active)}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              active
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                : 'gradient-bg text-white shadow-lg shadow-indigo-500/25'
            }`}
          >
            {active ? 'Stop Detection' : 'Start Emotion Detection'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Emotion</p>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = emotionIcons[currentEmotion] || User;
                    return <Icon size={28} className={
                      currentEmotion === 'Happy' ? 'text-green-500' :
                      currentEmotion === 'Sad' ? 'text-blue-500' :
                      currentEmotion === 'Fear' ? 'text-amber-500' :
                      currentEmotion === 'Angry' ? 'text-red-500' :
                      'text-gray-500'
                    } />;
                  })()}
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentEmotion}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{active ? `${emotionConfidence}%` : '--'}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Emotion Distribution</h3>
            <div className="space-y-4">
              {emotionData.distribution.map((e, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = emotionIcons[e.emotion] || User;
                        return <Icon size={14} style={{ color: e.color }} />;
                      })()}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{e.emotion}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{e.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: active ? `${e.value}%` : '0%', backgroundColor: e.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <Sparkles className="text-indigo-500 mx-auto mb-2" size={20} />
              <p className="text-xl font-bold text-gray-900 dark:text-white">5,231</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Detections</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <Heart className="text-pink-500 mx-auto mb-2" size={20} />
              <p className="text-xl font-bold text-gray-900 dark:text-white">35%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Happy Sessions</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-indigo-600 dark:text-indigo-400" size={18} />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Wellness Insight</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {active ? emotionData.wellnessInsight : 'Start emotion detection to receive personalized wellness insights.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
