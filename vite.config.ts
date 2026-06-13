import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Real_time_sign_language_translation/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
