import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import analyzer from 'rollup-plugin-analyzer';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@emotion/babel-plugin', { sourceMap: false }]
        ],
      },
      // fastRefresh: true
    }),
    compression({
      algorithm: 'brotlicompress',
      ext: '.br',
      threshold: 512,
      compressionOptions: { level: 11 },
      deleteOriginalAssets: false,
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 512,
      deleteOriginalAssets: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
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
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
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
    }),
    analyzer({ summaryOnly: true })
  ],
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-emotion': ['@emotion/react', '@emotion/styled'],
          'vendor-maps': ['pigeon-maps'],
          'vendor-qr': ['qrcode.react'],
          'vendor-utils': ['lodash', 'file-saver', 'jspdf']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        experimentalMinChunkSize: 10000,
        compact: true
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    assetsDir: 'assets',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 4173,
    open: true
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@mui/material', 
      'qrcode.react',
      '@emotion/react',
      '@emotion/styled',
      'lodash'
    ],
    exclude: ['@vite/client', '@vite/env'],
    esbuildOptions: {
      target: 'es2015',
      minify: true,
      treeShaking: true
    }
  },
  esbuild: {
    logLimit: 0,
    logLevel: 'warning',
    treeShaking: true
  }
});