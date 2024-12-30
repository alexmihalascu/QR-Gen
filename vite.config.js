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
      registerType: 'prompt',
      injectRegister: 'auto',
      strategies: 'generateSW',
      includeAssets: ['**/*'],
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
            src: '/assets/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
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
        ],
        start_url: 'https://qr-gen-eosin-rho.vercel.app/',
        scope: 'https://qr-gen-eosin-rho.vercel.app/',
        id: 'qr-gen',
        prefer_related_applications: false
      },
      workbox: {
  navigateFallback: '/index.html',
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.origin === self.origin,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-shell',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 1 săptămână
        }
      }
    },
    {
      urlPattern: /\.(?:js|css|html|png|svg|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30 
        }
      }
    }
  ],
  cleanupOutdatedCaches: true
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
  },

  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    cors: true
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '/src'
    }
  },

  esbuild: {
    // jsxInject: `import React from 'react'`,
    target: 'es2015'
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});