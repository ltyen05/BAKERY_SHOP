import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/admin/", 
  server: {
    host: '0.0.0.0', // Cho phép kết nối từ ngoài vào container
    port: 5173,
    strictPort: true,
    // THÊM DÒNG NÀY ĐỂ HẾT LỖI FORBIDDEN
    allowedHosts: ['husbakery.duckdns.org'], 
    hmr: {
      clientPort: 443 
    }
  }
})