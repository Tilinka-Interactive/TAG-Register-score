import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TAG-Register-score/', // Base path para GitHub Pages
  publicDir: 'public', // Asegurar que los archivos de public se copien a dist
  build: {
    // Asegurar que 404.html se copie
    copyPublicDir: true,
  },
})

