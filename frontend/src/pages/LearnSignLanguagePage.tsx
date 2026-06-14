import { useState } from 'react';
import {
  Star,
  Zap,
  Globe,
  Heart,
  Award,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Lock,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { signLanguageLessons, achievements } from '../data/mockData';

const iconMap: Record<string, typeof Star> = { Star, Zap, Globe, Heart, Award, Flame };

const categories = ['All', 'Greetings', 'Essential', 'Manners', 'Feelings', 'People', 'Education'];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  Intermediate: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Advanced: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

function HandIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export default function LearnSignLanguagePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSign, setSelectedSign] = useState<number | null>(null);

  const filtered = selectedCategory === 'All'
    ? signLanguageLessons
    : signLanguageLessons.filter(l => l.category === selectedCategory);

  const completedCount = signLanguageLessons.filter(l => l.progress === 100).length;
  const overallProgress = Math.round(signLanguageLessons.reduce((a, b) => a + b.progress, 0) / signLanguageLessons.length);
  const streak = 5;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learn Sign Language</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Interactive lessons and practice to master sign language</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{completedCount}/{signLanguageLessons.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Signs Learned</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <TrendingUp className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overall Progress</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Flame className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{streak} Days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Practice Streak</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Trophy className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'gradient-bg text-white shadow-md shadow-indigo-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedSign(selectedSign === lesson.id ? null : lesson.id)}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5
                          ${selectedSign === lesson.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30
                                  flex items-center justify-center">
                      <HandIcon size={22} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{lesson.name}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyColors[lesson.difficulty]}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  {lesson.progress === 100 ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <ChevronRight className={`text-gray-400 transition-transform ${selectedSign === lesson.id ? 'rotate-90' : ''}`} size={18} />
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{lesson.description}</p>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{lesson.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${lesson.progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-blue-400'}`}
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>

                {selectedSign === lesson.id && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold
                                      hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                      Practice This Sign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="text-amber-500" size={20} /> Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((a) => {
                const Icon = iconMap[a.icon] || Star;
                return (
                  <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    a.earned
                      ? 'bg-amber-50 dark:bg-amber-900/10'
                      : 'bg-gray-50 dark:bg-gray-800/50 opacity-60'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      a.earned
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {a.earned ? <Icon className="text-white" size={18} /> : <Lock className="text-gray-400" size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${a.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {a.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{a.description}</p>
                    </div>
                    {a.earned && <CheckCircle2 className="text-amber-500" size={16} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="text-indigo-500" size={20} /> Daily Practice
            </h3>
            <div className="space-y-2">
              {['Practice 5 signs', 'Complete a lesson', 'Review previous signs'].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    i < 2 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {i < 2 ? <CheckCircle2 className="text-white" size={14} /> : <span className="text-white text-[10px] font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${i < 2 ? 'text-gray-900 dark:text-white line-through' : 'text-gray-500 dark:text-gray-400'}`}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
