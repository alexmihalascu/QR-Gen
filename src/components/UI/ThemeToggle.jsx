import React from 'react';
import { IconButton, alpha } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme, theme } = useThemeContext();

  return (
    <IconButton 
      onClick={toggleTheme} 
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      sx={{ 
        color: theme.palette.primary.main,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        }
      }}
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;