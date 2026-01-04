import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BẮT BUỘC: Thêm dòng này để fix lỗi trắng trang khi chạy sub-path /admin
  base: "/admin/", 
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Đảm bảo không có proxy cũ gây xung đột
    strictPort: true,
    hmr: {
      // Giúp Hot Reload hoạt động qua HTTPS của Nginx Proxy Manager
      clientPort: 443 
    }
  }
})