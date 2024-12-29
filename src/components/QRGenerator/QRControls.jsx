import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  alpha,
  Stack,
  Typography,
  Slider,
  IconButton,
  Popover,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import {
  Palette,
  ZoomIn,
  ZoomOut,
  Opacity,
} from '@mui/icons-material';
import { debounce } from 'lodash';

const ControlPanel = styled(motion.div)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.85)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ColorButton = styled(IconButton)(({ theme, color }) => ({
  width: 42,
  height: 42,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
  background: color,
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
      : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.grey[800]
      : theme.palette.common.white,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[300],
  },
}));

const luminance = (hex) => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const QRControls = ({ options, onChange, qrRef, qrData }) => {
  const [colorAnchor, setColorAnchor] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [localOptions, setLocalOptions] = useState(options);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedOnChange = useCallback(
    debounce((newOptions) => {
      onChange(newOptions);
    }, 100),
    []
  );

  React.useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleOptionChange = (newOptions) => {
    const updatedOptions = { ...localOptions, ...newOptions };
    setLocalOptions(updatedOptions);
    debouncedOnChange(updatedOptions);
  };

  const handleColorClick = (event, type) => {
    setColorAnchor(event.currentTarget);
    setActiveColor(type);
  };

  const handleZoom = (direction) => {
    const newSize = direction === 'in' 
      ? Math.min(localOptions.size + 32, 1024)
      : Math.max(localOptions.size - 32, 128);
    handleOptionChange({ size: newSize });
  };

  return (
    <ControlPanel
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Stack spacing={4}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196f3, #1976d2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Customize QR Code
        </Typography>

        <Box>
          <Typography variant="subtitle2" mb={2}>
            Size: {localOptions.size}px
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Decrease size">
            <span>
                <IconButton 
                size="small"
                onClick={() => handleZoom('out')}
                disabled={localOptions.size <= 128}
                >
                <ZoomOut />
                </IconButton>
            </span>
            </Tooltip>
            <StyledSlider
            value={localOptions.size}
            min={128}
            max={1024}
            step={32}
            onChange={(_, value) => handleOptionChange({ size: value })}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            marks={[
                { value: 128, label: '128px' },
                { value: 512, label: '512px' },
                { value: 1024, label: '1024px' }
            ]}
            />
            <Tooltip title="Increase size">
            <span>
                <IconButton 
                size="small"
                onClick={() => handleZoom('in')}
                disabled={localOptions.size >= 512}
                >
                <ZoomIn />
                </IconButton>
            </span>
            </Tooltip>
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={2}>Colors</Typography>
          <Stack direction="row" spacing={2}>
          <Tooltip title="Change QR code color">
            <span>
                <ColorButton
                color={localOptions.fgColor}
                onClick={(e) => handleColorClick(e, 'fg')}
                aria-label="QR code color"
                >
                <Palette sx={{ color: luminance(localOptions.fgColor) > 0.5 ? '#000' : '#fff' }} />
                </ColorButton>
            </span>
            </Tooltip>
            <Stack direction="row" spacing={1}>
            <Tooltip title="Change background color">
            <span>
                <ColorButton
                color={localOptions.bgColor}
                onClick={(e) => handleColorClick(e, 'bg')}
                aria-label="Background color"
                sx={{ 
                    opacity: localOptions.bgColor === 'transparent' ? 0.5 : 1,
                    background: localOptions.bgColor === 'transparent' 
                    ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                    : localOptions.bgColor,
                }}
                >
                <Palette sx={{ color: luminance(localOptions.bgColor) > 0.5 ? '#000' : '#fff' }} />
                </ColorButton>
            </span>
            </Tooltip>
              <Tooltip title={localOptions.bgColor === 'transparent' ? 'Make background solid' : 'Make background transparent'}>
                <IconButton
                  onClick={() => handleOptionChange({ 
                    bgColor: localOptions.bgColor === 'transparent' ? '#ffffff' : 'transparent' 
                  })}
                  sx={{
                    color: localOptions.bgColor === 'transparent' 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    bgcolor: alpha(
                      localOptions.bgColor === 'transparent' 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary,
                      0.1
                    ),
                    '&:hover': {
                      bgcolor: alpha(
                        localOptions.bgColor === 'transparent' 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        0.2
                      ),
                    }
                  }}
                >
                  <Opacity />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        <Popover
          open={Boolean(colorAnchor)}
          anchorEl={colorAnchor}
          onClose={() => setColorAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          slotProps={{
            paper: {
              sx: {
                p: 3,
                width: 280,
                backdropFilter: 'blur(12px)',
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                boxShadow: theme.shadows[8]
              }
            }
          }}
        >
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {activeColor === 'fg' ? 'QR Code Color' : 'Background Color'}
            </Typography>
            {activeColor === 'bg' && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Transparent Background
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    handleOptionChange({ bgColor: 'transparent' });
                    setColorAnchor(null);
                  }}
                  sx={{
                    color: localOptions.bgColor === 'transparent' 
                      ? 'primary.main' 
                      : 'text.secondary'
                  }}
                >
                  <Opacity fontSize="small" />
                </IconButton>
              </Box>
            )}
            <HexColorPicker
              color={activeColor === 'fg' ? localOptions.fgColor : localOptions.bgColor}
              onChange={(color) => handleOptionChange({ 
                [activeColor === 'fg' ? 'fgColor' : 'bgColor']: color 
              })}
            />
          </Stack>
        </Popover>
      </Stack>
    </ControlPanel>
  );
};

export default QRControls;
