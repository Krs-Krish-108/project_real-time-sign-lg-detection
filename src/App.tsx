import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LiveTranslationPage from './pages/LiveTranslationPage';
import EmotionDetectionPage from './pages/EmotionDetectionPage';
import TranslationHistoryPage from './pages/TranslationHistoryPage';
import LearnSignLanguagePage from './pages/LearnSignLanguagePage';
import MultiLanguagePage from './pages/MultiLanguagePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/Real_time_sign_language_translation">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/live-translation" element={<LiveTranslationPage />} />
            <Route path="/emotion-detection" element={<EmotionDetectionPage />} />
            <Route path="/history" element={<TranslationHistoryPage />} />
            <Route path="/learn" element={<LearnSignLanguagePage />} />
            <Route path="/multi-language" element={<MultiLanguagePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
