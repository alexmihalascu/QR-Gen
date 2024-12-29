import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@emotion/babel-plugin', { sourceMap: false }]]
      }
    }),
    compression({
      algorithm: 'brotlicompress',
      ext: '.br',
      threshold: 2048,
      filter: /\.(js|css|html|json)$/i,
      deleteOriginalAssets: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/offline.html', // Changed from offlineFallback
        navigateFallbackAllowlist: [/^(?!\/__).*/], // Add allowlist for navigation fallback
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              backgroundSync: {
                name: 'apiQueue',
                options: {
                  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
                }
              }
            }
          }
        ]
      },
      manifest: {
        name: 'QR Code Generator',
        short_name: 'QR Gen',
        description: 'Advanced QR Code Generator - Works Offline',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'assets/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'assets/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'assets/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        scope: '/',
        prefer_related_applications: false
      }
    })
  ],

  build: {
    target: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'material': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'icons': ['@mui/icons-material'],
          'features': ['qrcode.react', 'pigeon-maps'],
          'utils': ['lodash', 'file-saver', 'jspdf']
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4KB
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    sourcemap: false
  },

  optimizeDeps: {
    entries: ['./src/**/*.{js,jsx}'],
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'qrcode.react'
    ],
    exclude: ['@vite/client']
  },

  server: {
    port: 3000,
    strictPort: true,
    open: true,
    host: true,
    cors: true
  }
});