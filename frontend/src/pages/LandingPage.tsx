import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Hand,
  Languages,
  Heart,
  Brain,
  Globe,
  ArrowRight,
  Moon,
  Sun,
  Sparkles,
  Eye,
  Mic,
  Shield,
  Zap,
  Users,
  ChevronRight,
} from 'lucide-react';

const features = [
  { icon: Languages, title: 'Real-Time Translation', desc: 'Instant sign language to text and speech conversion using advanced AI models.' },
  { icon: Heart, title: 'Emotion Intelligence', desc: 'Detect emotional context behind signs for more accurate and empathetic communication.' },
  { icon: Brain, title: 'AI-Powered Learning', desc: 'Interactive lessons with adaptive difficulty to help you learn sign language effectively.' },
  { icon: Globe, title: 'Multilingual Output', desc: 'Translate signs into 12+ languages, making communication truly universal.' },
];

const howItWorks = [
  { step: '01', title: 'Sign', desc: 'The user performs a sign language gesture in front of the camera.', icon: Hand },
  { step: '02', title: 'Detect', desc: 'AI detects hand landmarks and facial expressions in real-time.', icon: Eye },
  { step: '03', title: 'Translate', desc: 'The system translates detected signs into text, speech, and multiple languages.', icon: Mic },
];

const benefits = [
  { icon: Shield, title: 'Accessibility First', desc: 'Built with and for the hearing and speech-impaired community.' },
  { icon: Zap, title: 'Real-Time Speed', desc: 'Sub-second translation latency for natural conversation flow.' },
  { icon: Users, title: 'Inclusive Design', desc: 'Bridging communication gaps across different languages and abilities.' },
  { icon: Sparkles, title: 'AI Accuracy', desc: '96.8% recognition accuracy with continuous model improvement.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Hand className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Zenith Vision</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in-up">
              <Sparkles size={14} />
              AI-Powered Accessibility Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6 animate-fade-in-up stagger-1">
              Breaking Communication Barriers{' '}
              <span className="gradient-text">Through AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-2">
              Real-Time Sign Language Translation with Emotion Intelligence and Multilingual Communication
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="gradient-bg text-white px-8 py-4 rounded-2xl text-base font-semibold
                         hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5
                         transition-all duration-300 flex items-center gap-2"
              >
                Try Demo <ArrowRight size={18} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl text-base font-semibold text-gray-700 dark:text-gray-300
                         bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative max-w-4xl mx-auto animate-fade-in-up stagger-4">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 camera-frame aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Hand className="text-indigo-400 mb-3 animate-float" size={48} />
                    <p className="text-white/60 text-sm">Camera Preview</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="pulse-dot" />
                      <span className="text-green-400 text-xs font-medium">Live</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Detected Sign</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">HELLO</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">97%</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Emotion</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">Happy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4
                              group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
                  <f.icon className="text-white" size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Simple Yet Powerful</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-6
                              group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all duration-300">
                  <step.icon className="text-white" size={32} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900
                                 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center
                                 shadow-md">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <ChevronRight className="hidden md:block absolute right-0 top-1/3 text-indigo-300 dark:text-indigo-700" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Benefits</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Why Zenith Vision Matters</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700
                                    hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300">
                <b.icon size={28} className="text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Future Scope</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">The Road Ahead</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
            Zenith Vision aims to expand beyond recognition into a full communication ecosystem:
            integration with smart devices, AR glasses for real-time overlay translation,
            regional sign language support, and community-driven sign contributions.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {['AR Glasses Integration', 'Regional Sign Languages', 'Smart Device API'].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center gradient-bg rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Break Barriers?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Experience the future of inclusive communication with our AI-powered sign language translation platform.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold
                     hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
                     flex items-center gap-2 mx-auto"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Hand className="text-white" size={16} />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Zenith Vision</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Sign Language Translation Platform</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Academic Research Project</p>
        </div>
      </footer>
    </div>
  );
}