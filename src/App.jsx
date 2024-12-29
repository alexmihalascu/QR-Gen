import React from 'react';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Layout from './components/Layout/Layout';
import QRGenerator from './components/QRGenerator';
import { ThemeProvider } from './contexts/ThemeContext';

const emotionCache = createCache({
  key: 'css',
  prepend: true,
});

function App() {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider>
        <CssBaseline />
        <Layout>
          <QRGenerator />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;