import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 1. Giúp trình duyệt nạp đúng file JS/CSS tại đường dẫn /admin/
  base: "/admin/", 
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // 2. QUAN TRỌNG: Thêm dòng này để hết lỗi "Blocked request"
    allowedHosts: [
      'husbakery.duckdns.org'
    ],
    // 3. Hỗ trợ Hot Reload hoạt động mượt qua cổng HTTPS 443
    hmr: {
      clientPort: 443 
    }
  }
})