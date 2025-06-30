import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/vibe/',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        about: 'src/about.html'
      }
    }
  },
  server: {
    open: true
  }
})