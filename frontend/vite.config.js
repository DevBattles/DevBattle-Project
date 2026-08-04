import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    // Allow the Arena preview origin (and any sandbox host) to reach the dev server.
    allowedHosts: true,
    proxy: {
      '/api/v1/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api/v1/users': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      '/api/v1/questions': {
        target: 'http://localhost:4002',
        changeOrigin: true,
      },
    },
  },
})
