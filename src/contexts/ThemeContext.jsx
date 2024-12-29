import React, { createContext, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useLocalStorage from '../hooks/useLocalStorage';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const [mode, setMode] = useLocalStorage('theme', 'system');

  const actualTheme = mode === 'system' 
    ? (prefersDarkMode ? 'dark' : 'light')
    : mode;
  
  const theme = actualTheme === 'dark' ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'system') return prefersDarkMode ? 'light' : 'dark';
      if (prev === 'light') return 'dark';
      return 'light';
    });
  };

  useEffect(() => {
    if (mode === 'system') {
      document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode, mode]);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      toggleTheme, 
      theme,
      systemTheme: prefersDarkMode ? 'dark' : 'light',
      actualTheme 
    }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};