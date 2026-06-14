import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Languages,
  Heart,
  BookOpen,
  History,
  Globe,
  Settings,
  Info,
  Moon,
  Sun,
  Hand,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/live-translation', label: 'Live Translation', icon: Languages },
  { to: '/emotion-detection', label: 'Emotion Detection', icon: Heart },
  { to: '/learn', label: 'Learn Mode', icon: BookOpen },
  { to: '/history', label: 'Translation History', icon: History },
  { to: '/multi-language', label: 'Multi-Language', icon: Globe },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About Project', icon: Info },
];

export default function Sidebar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                     border-r border-gray-200/50 dark:border-gray-700/50 z-40
                     flex flex-col transition-transform duration-300
                     ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Hand className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Zenith Vision</h1>
              <p className="text-[10px] font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">AI Translator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <button onClick={toggleDarkMode} className="sidebar-link w-full">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span>Exit to Home</span>
          </button>
        </div>
      </aside>
    </>
  );
}
