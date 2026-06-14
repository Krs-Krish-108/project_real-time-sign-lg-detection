import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Type,
  Palette,
  Bell,
  Languages,
  Eye,
  Monitor,
  Save,
  RotateCcw,
  CheckCircle2 as CheckIcon,
} from 'lucide-react';
import { useState } from 'react';

const themes = [
  { name: 'Default', colors: ['bg-indigo-500', 'bg-blue-500', 'bg-purple-500'] },
  { name: 'Ocean', colors: ['bg-cyan-500', 'bg-blue-600', 'bg-indigo-600'] },
  { name: 'Forest', colors: ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500'] },
];

const languages = ['English', 'Hindi', 'French', 'Spanish', 'German', 'Japanese', 'Arabic', 'Mandarin'];

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleStyle = (on: boolean) =>
    `relative w-11 h-6 rounded-full transition-colors duration-200 ${
      on ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
    }`;

  const toggleKnob = (on: boolean) =>
    `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
      on ? 'translate-x-5' : ''
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your experience and preferences</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="text-indigo-500" size={18} /> : <Sun className="text-amber-500" size={18} />}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
              </div>
            </div>
            <button onClick={toggleDarkMode} className={toggleStyle(darkMode)}>
              <div className={toggleKnob(darkMode)} />
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTheme === theme.name
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex gap-1.5 mb-2 justify-center">
                    {theme.colors.map((c, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full ${c}`} />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Type className="text-indigo-500" size={18} />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Font Size</p>
              </div>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">A</span>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-lg text-gray-400 font-bold">A</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility</h2>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">High Contrast</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
            </div>
            <button onClick={() => setHighContrast(!highContrast)} className={toggleStyle(highContrast)}>
              <div className={toggleKnob(highContrast)} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-Translate</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automatically translate detected signs</p>
            </div>
            <button onClick={() => setAutoTranslate(!autoTranslate)} className={toggleStyle(autoTranslate)}>
              <div className={toggleKnob(autoTranslate)} />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Languages className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Language Preferences</h2>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Primary Language</p>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                     text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive alerts for translations and updates</p>
            </div>
            <button onClick={() => setNotifications(!notifications)} className={toggleStyle(notifications)}>
              <div className={toggleKnob(notifications)} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Sound Effects</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Play audio feedback for actions</p>
            </div>
            <button onClick={() => setSoundEffects(!soundEffects)} className={toggleStyle(soundEffects)}>
              <div className={toggleKnob(soundEffects)} />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                           text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            saved
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
              : 'gradient-bg text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
          }`}
        >
          {saved ? <><CheckIcon size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
