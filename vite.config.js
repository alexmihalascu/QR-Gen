import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@emotion/babel-plugin']
        ]
      }
    }),
    // Brotli compression
    compression({
      algorithm: 'brotlicompress',
      ext: '.br',
      threshold: 1024, // Only compress files > 1KB
      deleteOriginalAssets: false,
    }),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginalAssets: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['assets/favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'QR Code Generator',
        short_name: 'QR Gen',
        description: 'Advanced QR Code Generator',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/assets/favicon.ico',
            sizes: '48x48',
            type: 'image/icon'
          },
          {
            src: '/assets/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/assets/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-maps': ['pigeon-maps'],
          'vendor-qr': ['qrcode.react'],
          'vendor-utils': ['lodash', 'file-saver', 'jspdf']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096 // 4KB
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'qrcode.react']
  }
});