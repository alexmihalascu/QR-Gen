import { NightsStay, WbSunny } from '@mui/icons-material';
import { alpha, Box, IconButton, Tooltip } from '@mui/material';
import { keyframes } from '@mui/system';
import React from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';

// Animation for light mode icon
const sunriseAnimation = keyframes`
  0% {
    transform: scale(0.8) rotate(-10deg);
    opacity: 0.5;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

// Animation for dark mode icon
const moonriseAnimation = keyframes`
  0% {
    transform: scale(0.8) translateY(3px);
    opacity: 0.5;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
`;

const ThemeToggle = () => {
  const { mode, toggleTheme, theme } = useThemeContext();

  return (
    <Tooltip
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      placement="bottom"
      arrow
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          padding: '4px',
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.4)}, ${alpha(
                  theme.palette.background.paper,
                  0.1
                )})`
              : `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(
                  '#f5f5fa',
                  0.6
                )})`,
          backdropFilter: 'blur(10px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.05)'
              : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(255, 255, 255, 0.7)',
        }}
      >
        <IconButton
          onClick={toggleTheme}
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          sx={{
            color: mode === 'dark' ? theme.palette.primary.light : '#FDB813', // Sun color
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: alpha(mode === 'dark' ? theme.palette.primary.main : '#FDB813', 0.1),
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.12,
              borderRadius: '50%',
              background:
                mode === 'dark'
                  ? `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`
                  : `radial-gradient(circle, #FDB813 0%, transparent 70%)`,
              zIndex: -1,
              transition: 'all 0.3s ease',
            },
          }}
        >
          {mode === 'dark' ? (
            <WbSunny
              sx={{
                animation: `${sunriseAnimation} 0.5s ease forwards`,
                filter: 'drop-shadow(0 0 3px rgba(253, 184, 19, 0.5))',
              }}
            />
          ) : (
            <NightsStay
              sx={{
                animation: `${moonriseAnimation} 0.5s ease forwards`,
                filter: 'drop-shadow(0 0 3px rgba(120, 120, 250, 0.3))',
              }}
            />
          )}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle;
