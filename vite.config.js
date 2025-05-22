import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/register': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/login': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/logout': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/profile': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/Uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/health': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
