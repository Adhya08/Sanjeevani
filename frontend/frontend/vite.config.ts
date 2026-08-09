import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        secure: false,
      },
    },
  },
})
