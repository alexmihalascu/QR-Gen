import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Add performance monitoring
if (process.env.NODE_ENV === 'development') {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime, entry.element);
      }
    });
  });
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Preconnect to external resources
const preconnectLinks = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

preconnectLinks.forEach(href => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (href.includes('gstatic')) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
});

// Add font-display: swap to optimize font loading
const fontDisplayStyle = document.createElement('style');
fontDisplayStyle.textContent = `
  @font-face {
    font-family: 'Roboto';
    font-display: swap;
  }
`;
document.head.appendChild(fontDisplayStyle);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);