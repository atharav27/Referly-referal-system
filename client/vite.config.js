import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module for resolving directories

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Resolve "@" to the "src" folder
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'referly-referal-system-api.vercel.app', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});