import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  build: {
    sourcemap: false, // TẮT cái này để tiết kiệm RAM
    rollupOptions: {
      maxParallelFileOps: 2 // Giới hạn số file xử lý cùng lúc
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/admin': {
        target: 'https://husbakery.duckdns.org',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/superadmin': {
        target: 'https://husbakery.duckdns.org',
        changeOrigin: true
      }
    }
  }
})