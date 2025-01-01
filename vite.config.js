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
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      manifest: false, // Use the manifest.json from public directory
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        rollupFormat: 'iife',
        maximumFileSizeToCacheInBytes: 5000000,
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,woff2}',
          'assets/**/*'
        ],
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