export const dashboardStats = {
  totalTranslations: 12847,
  emotionDetections: 5231,
  languagesSupported: 12,
  accuracyScore: 96.8,
};

export const emotionData = {
  current: 'Happy',
  confidence: 92,
  distribution: [
    { emotion: 'Happy', value: 35, color: '#22c55e' },
    { emotion: 'Sad', value: 12, color: '#3b82f6' },
    { emotion: 'Fear', value: 8, color: '#f97316' },
    { emotion: 'Angry', value: 5, color: '#ef4444' },
    { emotion: 'Neutral', value: 40, color: '#94a3b8' },
  ],
  wellnessInsight: 'Your emotional state has been predominantly positive this session. Stress levels are low and engagement is high.',
};

export const translationHistory = [
  { id: 1, date: '2025-06-12', time: '14:32', detectedSign: 'HELLO', sentence: 'Hello, how are you today?', emotion: 'Happy', language: 'English' },
  { id: 2, date: '2025-06-12', time: '14:28', detectedSign: 'THANK YOU', sentence: 'Thank you for your help.', emotion: 'Grateful', language: 'English' },
  { id: 3, date: '2025-06-12', time: '14:15', detectedSign: 'HELP', sentence: 'Can you help me please?', emotion: 'Neutral', language: 'Hindi' },
  { id: 4, date: '2025-06-12', time: '13:55', detectedSign: 'YES', sentence: 'Yes, I agree with that.', emotion: 'Happy', language: 'French' },
  { id: 5, date: '2025-06-12', time: '13:40', detectedSign: 'NO', sentence: 'No, I do not want that.', emotion: 'Neutral', language: 'Spanish' },
  { id: 6, date: '2025-06-11', time: '18:20', detectedSign: 'SORRY', sentence: 'I am sorry for the inconvenience.', emotion: 'Sad', language: 'English' },
  { id: 7, date: '2025-06-11', time: '17:45', detectedSign: 'PLEASE', sentence: 'Please pass the document.', emotion: 'Neutral', language: 'English' },
  { id: 8, date: '2025-06-11', time: '16:30', detectedSign: 'LOVE', sentence: 'I love this beautiful day.', emotion: 'Happy', language: 'French' },
  { id: 9, date: '2025-06-11', time: '15:10', detectedSign: 'GOODBYE', sentence: 'Goodbye, see you tomorrow.', emotion: 'Happy', language: 'Spanish' },
  { id: 10, date: '2025-06-11', time: '14:00', detectedSign: 'FRIEND', sentence: 'My friend is coming over.', emotion: 'Happy', language: 'English' },
  { id: 11, date: '2025-06-10', time: '12:20', detectedSign: 'WATER', sentence: 'Can I have some water?', emotion: 'Neutral', language: 'Hindi' },
  { id: 12, date: '2025-06-10', time: '11:45', detectedSign: 'FOOD', sentence: 'I would like some food please.', emotion: 'Neutral', language: 'English' },
];

export const signLanguageLessons = [
  { id: 1, name: 'Hello', difficulty: 'Beginner', progress: 100, description: 'Wave hand with open palm', category: 'Greetings' },
  { id: 2, name: 'Thank You', difficulty: 'Beginner', progress: 85, description: 'Touch chin with fingertips, move hand forward', category: 'Greetings' },
  { id: 3, name: 'Help', difficulty: 'Beginner', progress: 72, description: 'Fist on flat palm, raise together', category: 'Essential' },
  { id: 4, name: 'Yes', difficulty: 'Beginner', progress: 95, description: 'Nod fist up and down', category: 'Essential' },
  { id: 5, name: 'No', difficulty: 'Beginner', progress: 90, description: 'Index and middle finger snap to thumb', category: 'Essential' },
  { id: 6, name: 'Please', difficulty: 'Intermediate', progress: 60, description: 'Circular motion on chest with flat hand', category: 'Manners' },
  { id: 7, name: 'Sorry', difficulty: 'Intermediate', progress: 45, description: 'Fist circles on chest', category: 'Manners' },
  { id: 8, name: 'Love', difficulty: 'Intermediate', progress: 55, description: 'Cross arms over chest', category: 'Feelings' },
  { id: 9, name: 'Friend', difficulty: 'Intermediate', progress: 38, description: 'Link index fingers together', category: 'People' },
  { id: 10, name: 'Family', difficulty: 'Advanced', progress: 20, description: 'Both hands circle outward in front of body', category: 'People' },
  { id: 11, name: 'Learn', difficulty: 'Advanced', progress: 15, description: 'Pick up from open palm to forehead', category: 'Education' },
  { id: 12, name: 'Understand', difficulty: 'Advanced', progress: 25, description: 'Point to forehead, move fist forward', category: 'Education' },
];

export const multiLanguageTranslations = [
  { language: 'English', flag: '🇬🇧', translation: 'Hello', code: 'en' },
  { language: 'Hindi', flag: '🇮🇳', translation: 'नमस्ते', code: 'hi' },
  { language: 'French', flag: '🇫🇷', translation: 'Bonjour', code: 'fr' },
  { language: 'Spanish', flag: '🇪🇸', translation: 'Hola', code: 'es' },
  { language: 'German', flag: '🇩🇪', translation: 'Hallo', code: 'de' },
  { language: 'Japanese', flag: '🇯🇵', translation: 'こんにちは', code: 'ja' },
  { language: 'Arabic', flag: '🇸🇦', translation: 'مرحبا', code: 'ar' },
  { language: 'Portuguese', flag: '🇵🇹', translation: 'Olá', code: 'pt' },
  { language: 'Mandarin', flag: '🇨🇳', translation: '你好', code: 'zh' },
  { language: 'Korean', flag: '🇰🇷', translation: '안녕하세요', code: 'ko' },
  { language: 'Italian', flag: '🇮🇹', translation: 'Ciao', code: 'it' },
  { language: 'Russian', flag: '🇷🇺', translation: 'Привет', code: 'ru' },
];

export const achievements = [
  { id: 1, name: 'First Sign', description: 'Complete your first sign', icon: 'Star', earned: true },
  { id: 2, name: 'Quick Learner', description: 'Learn 5 signs in one day', icon: 'Zap', earned: true },
  { id: 3, name: 'Polyglot', description: 'Translate into 3 languages', icon: 'Globe', earned: true },
  { id: 4, name: 'Emotion Master', description: 'Detect 50 emotions', icon: 'Heart', earned: false },
  { id: 5, name: 'Streak Keeper', description: '7-day practice streak', icon: 'Flame', earned: false },
  { id: 6, name: 'Perfect Score', description: '100% accuracy on a sign', icon: 'Award', earned: true },
];

export const weeklyActivity = [
  { day: 'Mon', translations: 45, emotions: 12 },
  { day: 'Tue', translations: 62, emotions: 18 },
  { day: 'Wed', translations: 38, emotions: 9 },
  { day: 'Thu', translations: 71, emotions: 22 },
  { day: 'Fri', translations: 53, emotions: 15 },
  { day: 'Sat', translations: 89, emotions: 31 },
  { day: 'Sun', translations: 42, emotions: 11 },
];

export const techStack = [
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'MediaPipe', category: 'Hand Tracking' },
  { name: 'OpenCV', category: 'Image Processing' },
  { name: 'TensorFlow', category: 'ML Framework' },
  { name: 'LSTM', category: 'Sequence Model' },
  { name: 'Vite', category: 'Build Tool' },
  { name: 'Tailwind CSS', category: 'Styling' },
];

export const workflowSteps = [
  'User Sign',
  'Camera Input',
  'Hand Detection',
  'Landmark Extraction',
  'AI Prediction',
  'Sentence Formation',
  'Emotion Detection',
  'Translation',
  'Text + Speech Output',
];
