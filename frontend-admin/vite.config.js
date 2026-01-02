import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bắt buộc để chạy được trong Docker
    port: 5173,      // Cổng mặc định của Vite
    // Xóa sạch phần proxy đi để tránh xung đột đường dẫn
  }
})