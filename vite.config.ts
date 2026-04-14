import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false // ĐÂY LÀ LỆNH TẮT CÁI MÀNG VÔ HÌNH CHẶN CLICK
    }
  }
})