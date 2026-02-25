import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // nastavuje @ jako odkaz na src
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    watch: {
      usePolling: true
    },
    allowedHosts: 'all'
  },
})