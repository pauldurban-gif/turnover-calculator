import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'TurnoverCalculator',
      fileName: () => 'turnover-calculator.js',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
})
