import { alpha, Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import React from 'react';

const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const theme = useTheme();

  // Define sizes based on the prop
  const spinnerSizes = {
    small: { spinner: 32, container: 120 },
    medium: { spinner: 48, container: 180 },
    large: { spinner: 64, container: 240 },
  };

  const currentSize = spinnerSizes[size] || spinnerSizes.medium;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: currentSize.container,
        padding: 3,
        borderRadius: '20px',
        animation: `${pulse} 2s infinite ease-in-out`,
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
            ? '0 8px 32px rgba(0, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: currentSize.spinner + 16,
          height: currentSize.spinner + 16,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {/* Outer decorative rings */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            animation: `${rotateAnimation} 3s linear infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            borderRadius: '50%',
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.15)}`,
            animation: `${rotateAnimation} 5s linear infinite reverse`,
          }}
        />

        {/* Actual spinner */}
        <CircularProgress
          size={currentSize.spinner}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          letterSpacing: '0.03em',
          opacity: 0.9,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
