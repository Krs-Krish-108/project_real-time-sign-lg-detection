import { useState } from 'react';
import {
  ArrowRight,
  Copy,
  Volume2,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import { multiLanguageTranslations } from '../data/mockData';

const inputSigns = [
  { sign: 'HELLO', translations: multiLanguageTranslations },
  { sign: 'THANK YOU', translations: [
    { language: 'English', flag: '🇬🇧', translation: 'Thank you', code: 'en' },
    { language: 'Hindi', flag: '🇮🇳', translation: 'धन्यवाद', code: 'hi' },
    { language: 'French', flag: '🇫🇷', translation: 'Merci', code: 'fr' },
    { language: 'Spanish', flag: '🇪🇸', translation: 'Gracias', code: 'es' },
    { language: 'German', flag: '🇩🇪', translation: 'Danke', code: 'de' },
    { language: 'Japanese', flag: '🇯🇵', translation: 'ありがとう', code: 'ja' },
    { language: 'Arabic', flag: '🇸🇦', translation: 'شكرا', code: 'ar' },
    { language: 'Portuguese', flag: '🇵🇹', translation: 'Obrigado', code: 'pt' },
    { language: 'Mandarin', flag: '🇨🇳', translation: '谢谢', code: 'zh' },
    { language: 'Korean', flag: '🇰🇷', translation: '감사합니다', code: 'ko' },
    { language: 'Italian', flag: '🇮🇹', translation: 'Grazie', code: 'it' },
    { language: 'Russian', flag: '🇷🇺', translation: 'Спасибо', code: 'ru' },
  ]},
  { sign: 'HELP', translations: [
    { language: 'English', flag: '🇬🇧', translation: 'Help', code: 'en' },
    { language: 'Hindi', flag: '🇮🇳', translation: 'मदद', code: 'hi' },
    { language: 'French', flag: '🇫🇷', translation: 'Aide', code: 'fr' },
    { language: 'Spanish', flag: '🇪🇸', translation: 'Ayuda', code: 'es' },
    { language: 'German', flag: '🇩🇪', translation: 'Hilfe', code: 'de' },
    { language: 'Japanese', flag: '🇯🇵', translation: '助けて', code: 'ja' },
    { language: 'Arabic', flag: '🇸🇦', translation: 'مساعدة', code: 'ar' },
    { language: 'Portuguese', flag: '🇵🇹', translation: 'Ajuda', code: 'pt' },
    { language: 'Mandarin', flag: '🇨🇳', translation: '帮助', code: 'zh' },
    { language: 'Korean', flag: '🇰🇷', translation: '도움', code: 'ko' },
    { language: 'Italian', flag: '🇮🇹', translation: 'Aiuto', code: 'it' },
    { language: 'Russian', flag: '🇷🇺', translation: 'Помощь', code: 'ru' },
  ]},
];

export default function MultiLanguagePage() {
  const [selectedInput, setSelectedInput] = useState(0);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('All');

  const current = inputSigns[selectedInput];

  const filteredTranslations = targetLanguage === 'All'
    ? current.translations
    : current.translations.filter(t => t.language === targetLanguage);

  const handleCopy = (code: string) => {
    setCopiedLang(code);
    setTimeout(() => setCopiedLang(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Multi-Language Translation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Translate detected signs into multiple languages simultaneously</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Detected Sign</h3>
            <div className="text-center py-6">
              <p className="text-5xl font-extrabold gradient-text mb-2">{current.sign}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <ArrowRight className="text-gray-400" size={16} />
                <span className="text-sm text-gray-500 dark:text-gray-400">{current.translations.length} languages</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Input Sign</h3>
            <div className="space-y-2">
              {inputSigns.map((input, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedInput(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedInput === i
                      ? 'gradient-bg text-white shadow-md shadow-indigo-500/20'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {input.sign}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Filter Language</h3>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                       text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="All">All Languages</option>
              {current.translations.map(t => (
                <option key={t.code} value={t.language}>{t.flag} {t.language}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredTranslations.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.flag}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.language}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(t.code)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copiedLang === t.code ? <CheckCircle2 className="text-green-500" size={14} /> : <Copy className="text-gray-400" size={14} />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                      <Volume2 className="text-gray-400" size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t.translation}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Languages size={10} />
                  <span>{t.code.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
