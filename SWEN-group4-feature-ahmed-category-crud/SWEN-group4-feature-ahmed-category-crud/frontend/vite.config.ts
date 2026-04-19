import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    proxy: {
      '/auth': 'http://localhost:8080',
      '/items': 'http://localhost:8080',
      '/categories': 'http://localhost:8080',
      '/collection': 'http://localhost:8080',
    }
  }
})