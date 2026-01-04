import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 1. Giúp load file JS/CSS từ đường dẫn /admin/
  base: "/admin/", 
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 2. GIẢI QUYẾT LỖI "Blocked request": Cho phép tên miền của bạn đi qua
    allowedHosts: [
      'husbakery.duckdns.org'
    ],
    // 3. Giúp Hot Reload hoạt động mượt qua Nginx Proxy Manager
    hmr: {
      clientPort: 443 
    }
  }
})