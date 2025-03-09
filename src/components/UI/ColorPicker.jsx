import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import PaletteIcon from '@mui/icons-material/Palette';
import {
  alpha,
  Box,
  Fade,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

// Enhanced color input with modern aesthetic
const ColorInput = styled('input')(({ theme }) => ({
  width: 56,
  height: 56,
  padding: 0,
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: 200,
  }),

  '&::-webkit-color-swatch-wrapper': {
    padding: 0,
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: '14px',
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 4px 12px rgba(0, 0, 0, 0.4), inset 0 2px 5px rgba(255, 255, 255, 0.1)`
        : `0 4px 12px rgba(0, 0, 0, 0.08), inset 0 2px 5px rgba(255, 255, 255, 0.7)`,
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.15)}`,
  },
  '&:focus': {
    outline: 'none',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}, 0 6px 20px ${alpha(
      theme.palette.common.black,
      0.15
    )}`,
  },
}));

// Glass-style text field
const StyledTextField = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    backgroundColor: alpha(
      theme.palette.background.paper,
      theme.palette.mode === 'dark' ? 0.1 : 0.7
    ),
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
      duration: 200,
    }),
    '&:hover': {
      backgroundColor: alpha(
        theme.palette.background.paper,
        theme.palette.mode === 'dark' ? 0.15 : 0.85
      ),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(
        theme.palette.background.paper,
        theme.palette.mode === 'dark' ? 0.2 : 0.9
      ),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}, 0 8px 16px ${alpha(
        theme.palette.common.black,
        0.1
      )}`,
    },
  },
  '.MuiOutlinedInput-input': {
    padding: '10px 14px',
    color: theme.palette.text.primary,
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.divider, 0.8),
    borderWidth: '1px',
  },
  '.MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

// Modern ColorPicker component
const ColorPicker = ({ label, color, onChange }) => {
  const theme = useTheme();
  const [showCopied, setShowCopied] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (color && !recentColors.includes(color) && color.match(/^#[0-9A-F]{6}$/i)) {
      setRecentColors(prev => [color, ...prev.slice(0, 5)]);
    }
  }, [color]);

  const handleColorCopy = () => {
    navigator.clipboard.writeText(color);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleHistoryClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHistorySelect = historyColor => {
    onChange(historyColor);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        position: 'relative',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(40,40,50,0.8), rgba(30,30,40,0.4))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,250,0.7))',
        backdropFilter: 'blur(10px)',
        padding: 2.5,
        borderRadius: '16px',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 2px 3px rgba(255, 255, 255, 0.7)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {recentColors.length > 0 && (
            <Tooltip title="Color history">
              <IconButton
                size="small"
                onClick={handleHistoryClick}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="small"
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <PaletteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: '14px',
            padding: '3px',
            background: `linear-gradient(145deg, ${alpha(
              theme.palette.background.paper,
              0.4
            )}, ${alpha(theme.palette.background.paper, 0.1)})`,
          }}
        >
          <ColorInput
            type="color"
            value={color}
            onChange={e => onChange(e.target.value)}
            aria-label="Select color"
          />
        </Box>

        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          <StyledTextField
            value={color}
            onChange={e => onChange(e.target.value)}
            size="small"
            fullWidth
            placeholder="#000000"
            sx={{
              input: {
                fontFamily: 'monospace',
                fontWeight: 500,
                letterSpacing: '0.05em',
                fontSize: '0.95rem',
              },
            }}
            InputProps={{
              endAdornment: (
                <Tooltip title={showCopied ? 'Copied!' : 'Copy color code'}>
                  <IconButton edge="end" onClick={handleColorCopy} size="small" sx={{ mr: 0.5 }}>
                    <Fade in={showCopied}>
                      {showCopied ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )}
                    </Fade>
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 1,
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
      >
        <Typography sx={{ p: 1, fontWeight: 500, fontSize: '0.85rem' }}>Recent Colors</Typography>
        <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
          {recentColors.map((historyColor, index) => (
            <Tooltip key={index} title={historyColor}>
              <Box
                onClick={() => handleHistorySelect(historyColor)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: historyColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;
