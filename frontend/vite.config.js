import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  proxy: {
    '/api':{
      target: 'http://localhost:5000',
     
    },
    watch: {
      usePolling: true,  // Enables polling for file changes (useful for some systems)
      interval: 100,     // Adjust polling interval if needed
  },
  }
})
