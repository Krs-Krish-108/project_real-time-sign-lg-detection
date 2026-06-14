import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  History,
  Languages,
  Clock,
  ChevronDown,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { getHistory, type HistoryItem } from '../services/api';

export default function TranslationHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const emotions = ['All', 'Happy', 'Sad', 'Neutral', 'Grateful'];
  const languages = ['All', 'English', 'Hindi', 'French', 'Spanish'];

  // ── Load history from backend ──────────────────────────────────────────────
  const loadHistory = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const result = await getHistory();
      setHistory(result.history);
    } catch (err) {
      console.error('Failed to load history:', err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // ── CSV export ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Detected Sign', 'Sentence', 'Emotion', 'Language', 'Confidence'];
    const rows = history.map((item) => [
      item.date,
      item.time,
      item.detectedSign,
      item.sentence,
      item.emotion,
      item.language,
      `${item.confidence}%`,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = history.filter((item) => {
    const matchesSearch =
      item.sentence.toLowerCase().includes(search.toLowerCase()) ||
      item.detectedSign.toLowerCase().includes(search.toLowerCase());
    const matchesEmotion = filterEmotion === 'All' || item.emotion === filterEmotion;
    const matchesLanguage = filterLanguage === 'All' || item.language === filterLanguage;
    return matchesSearch && matchesEmotion && matchesLanguage;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Translation History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse and filter live session detections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800
                       text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700
                       border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20
                       text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100
                       dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <WifiOff size={16} className="flex-shrink-0" />
          <span>
            Cannot reach backend. Make sure{' '}
            <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">uvicorn app:app --reload</code>{' '}
            is running, then click Refresh.
          </span>
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by sign or sentence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         text-sm text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Filter size={16} /> Filters{' '}
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Emotion</label>
              <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {emotions.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center">
            <RefreshCw className="mx-auto text-indigo-400 mb-3 animate-spin" size={32} />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading session history…</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Date', 'Time', 'Detected Sign', 'Generated Sentence', 'Confidence', 'Emotion', 'Language'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Clock size={12} /> {item.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                          <Languages size={12} /> {item.detectedSign}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {item.sentence}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {item.confidence}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                            item.emotion === 'Happy'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : item.emotion === 'Sad'
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : item.emotion === 'Grateful'
                              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {item.emotion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((item) => (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                      {item.detectedSign}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.date} {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.sentence}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.confidence}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      item.emotion === 'Happy'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : item.emotion === 'Sad'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.emotion}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.language}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <History className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {history.length === 0
                    ? 'No detections yet — start the Live Translation to build history.'
                    : 'No results matching your search or filters.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer count */}
      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> of{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{history.length}</span> session detections
        </p>
      )}
    </div>
  );
}
