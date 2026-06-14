import {
  Info,
  Target,
  BookOpen,
  Code,
  ArrowDown,
  Zap,
  Cpu,
  Eye,
  Hand,
  Mic,
  Brain,
  Languages,
} from 'lucide-react';
import { techStack, workflowSteps } from '../data/mockData';

const workflowIcons = [Hand, Eye, Cpu, Brain, Languages, Mic, Brain, Languages, Zap];

const objectives = [
  'Develop a real-time sign language translation system using computer vision and deep learning.',
  'Integrate emotion detection to add contextual intelligence to translations.',
  'Support multilingual output to maximize accessibility across linguistic barriers.',
  'Create an intuitive, accessible user interface for hearing and speech-impaired individuals.',
  'Achieve high accuracy (>95%) in sign recognition using LSTM and landmark-based models.',
];

const futureScope = [
  { title: 'AR Glasses Integration', desc: 'Overlay real-time translations on smart glasses for seamless in-person communication.' },
  { title: 'Regional Sign Languages', desc: 'Expand support beyond ASL to include BSL, ISL, and other regional sign language variants.' },
  { title: 'Community Sign Database', desc: 'Allow users to contribute new signs and regional variations to improve the model.' },
  { title: 'Smart Device Integration', desc: 'API for integrating SignBridge with IoT devices, kiosks, and digital signage.' },
  { title: 'Offline Mode', desc: 'Edge computing support for translation without constant internet connectivity.' },
  { title: 'Conversation Mode', desc: 'Two-way translation: voice-to-sign and sign-to-voice for complete dialogue support.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About the Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">AI-Powered Sign Language Translation & Inclusive Communication Platform</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border-l-4 border-indigo-500">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-indigo-600 dark:text-indigo-400" size={22} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Problem Statement</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Over 70 million deaf and hard-of-hearing individuals worldwide rely on sign language as their primary mode of communication.
          However, the vast majority of society does not understand sign language, creating persistent communication barriers in education,
          healthcare, employment, and daily interactions. Existing solutions are either too slow, inaccurate, or lack the contextual
          understanding needed for meaningful communication. There is a critical need for a real-time, accurate, and emotionally intelligent
          sign language translation system that bridges this gap.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Target className="text-indigo-600 dark:text-indigo-400" size={22} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Objectives</h2>
        </div>
        <div className="space-y-4">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-md shadow-indigo-500/20">
                {i + 1}
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pt-1">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="text-indigo-600 dark:text-indigo-400" size={22} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Workflow</h2>
        </div>
        <div className="flex flex-col items-center gap-0">
          {workflowSteps.map((step, i) => {
            const Icon = workflowIcons[i] || Cpu;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center gap-4 w-full max-w-md">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div className="flex-1 glass-card rounded-xl px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{step}</span>
                      <span className="text-xs text-gray-400">Step {i + 1}</span>
                    </div>
                  </div>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <ArrowDown className="text-indigo-400/50" size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Code className="text-indigo-600 dark:text-indigo-400" size={22} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700
                                  hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{tech.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{tech.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-indigo-600 dark:text-indigo-400" size={22} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Future Scope</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {futureScope.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700
                                  hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:-translate-y-0.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
