import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // Minification settings
    minify: 'esbuild',
    cssMinify: true,

    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          // Three.js (largest dependency)
          if (id.includes('node_modules/three/') || id.includes('node_modules/@react-three/')) {
            return 'three-vendor'
          }
          // i18n
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n-vendor'
          }
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor'
          }
        },
      },
    },

    // Generate source maps for debugging (optional)
    sourcemap: false,

    // Report compressed size
    reportCompressedSize: true,
  },
})
