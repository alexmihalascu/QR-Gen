import React from 'react';
import { TextField, Typography, Box, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

const ColorInput = styled('input')(({ theme }) => ({
    width: 50,
    height: 50,
    padding: 0,
    border: 'none',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: theme.transitions.create(['transform', 'box-shadow']),
    
    '&::-webkit-color-swatch-wrapper': {
      padding: 0,
    },
    '&::-webkit-color-swatch': {
      border: `2px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      boxShadow: `0 0 0 1px ${alpha(
        theme.palette.mode === 'dark' 
          ? theme.palette.common.white 
          : theme.palette.common.black, 
        0.1
      )}`,
    },
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '&:focus': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    }
  }));
  
  const StyledTextField = styled(TextField)(({ theme }) => ({
    '.MuiOutlinedInput-root': {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(8px)',
      transition: theme.transitions.create([
        'background-color',
        'box-shadow',
        'border-color'
      ]),
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
      }
    }
  }));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    transition: theme.transitions.create([
      'background-color',
      'box-shadow',
      'border-color'
    ]),
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    }
  },
  '.MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
  },
  '.MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  }
}));

const ColorPicker = ({ label, color, onChange }) => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography
        gutterBottom
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          mb: 1
        }}
      >
        {label}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        '& > *': { borderRadius: theme.shape.borderRadius }
      }}>
        
        <ColorInput
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
        />
        <StyledTextField
          value={color}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="#000000"
        />
      </Box>
    </Box>
  );
};

export default ColorPicker;