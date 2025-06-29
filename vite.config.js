import { defineConfig } from 'vite'

export default defineConfig({
  root: 'docs',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'docs/index.html'
      }
    }
  },
  server: {
    open: true
  }
})