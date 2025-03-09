import styled from '@emotion/styled';
import { CloudUpload, Delete, Opacity, Palette, ZoomIn, ZoomOut } from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Popover,
  Slider,
  Stack,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import React, { memo, useCallback, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ControlPanel = styled(motion.div)(({ theme }) => ({
  contain: 'content',
  contentVisibility: 'auto',
  containIntrinsicSize: '0 500px',
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.85)
      : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  '@supports not (backdrop-filter: blur(12px))': {
    background:
      theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.paper,
  },
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  '@supports (background-clip: text) or (-webkit-background-clip: text)': {
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
        : `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    '@media (prefers-reduced-motion: no-preference)': {
      transition: theme.transitions.create(['background-image', 'color'], {
        duration: theme.transitions.duration.standard,
      }),
    },
  },
  '@media (max-width: 600px)': {
    background: 'none',
    WebkitBackgroundClip: 'initial',
    WebkitTextFillColor: 'initial',
    color: theme.palette.primary.main,
  },
  contain: 'paint',
}));

const ColorButton = styled(IconButton)(({ theme, color }) => ({
  width: 42,
  height: 42,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
  background: color,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[4],
  },
  '@media (max-width: 600px)': {
    width: 36,
    height: 36,
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
        : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.common.white,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:before': {
      display: 'none',
    },
    '@media (max-width: 600px)': {
      height: 20,
      width: 20,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  },
  '@media (max-width: 600px)': {
    height: 6,
  },
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    padding: theme.spacing(3),
    width: 280,
    backdropFilter: 'blur(12px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    boxShadow: theme.shadows[8],
    '@media (max-width: 600px)': {
      width: 260,
      padding: theme.spacing(2),
    },
    '@supports not (backdrop-filter: blur(12px))': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const LogoPreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 100,
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  position: 'relative',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  '&:hover .logo-actions': {
    opacity: 1,
  },
}));

const LogoActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(0.5),
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
}));

const luminance = hex => {
  if (hex === 'transparent') return 0;
  try {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  } catch {
    return 0;
  }
};

const QRControls = memo(({ options, onChange, qrRef, qrData }) => {
  const [colorAnchor, setColorAnchor] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [localOptions, setLocalOptions] = useState({
    ...options,
    logoSize: options.logoSize || 60,
    logoEnabled: options.logoEnabled || false,
    logoImage: options.logoImage || null,
  });
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedOnChange = useCallback(
    debounce(newOptions => {
      onChange(newOptions);
    }, 100),
    [onChange]
  );

  React.useEffect(() => {
    setLocalOptions(prevOptions => ({
      ...prevOptions,
      ...options,
    }));
  }, [options]);

  const handleOptionChange = useCallback(
    newOptions => {
      const updatedOptions = { ...localOptions, ...newOptions };
      setLocalOptions(updatedOptions);
      debouncedOnChange(updatedOptions);
    },
    [localOptions, debouncedOnChange]
  );

  const handleColorClick = useCallback((event, type) => {
    setColorAnchor(event.currentTarget);
    setActiveColor(type);
  }, []);

  const handleZoom = useCallback(
    direction => {
      const newSize =
        direction === 'in'
          ? Math.min(localOptions.size + 32, 1024)
          : Math.max(localOptions.size - 32, 128);
      handleOptionChange({ size: newSize });
    },
    [localOptions.size, handleOptionChange]
  );

  const handleFileChange = useCallback(
    event => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          handleOptionChange({
            logoImage: e.target.result,
            logoEnabled: true,
          });
        };
        reader.readAsDataURL(file);
      }
      // Reset the input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleOptionChange]
  );

  const handleRemoveLogo = useCallback(() => {
    handleOptionChange({
      logoImage: null,
      logoEnabled: false,
    });
  }, [handleOptionChange]);

  const handleLogoToggle = useCallback(
    event => {
      handleOptionChange({ logoEnabled: event.target.checked });
    },
    [handleOptionChange]
  );

  return (
    <ControlPanel
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isMobile ? 0 : 0.3 }}
    >
      <Stack spacing={isMobile ? 3 : 4}>
        <StyledHeading component="h2" variant="h2">
          Customize QR Code
        </StyledHeading>

        <Box>
          <Typography
            id="size-slider-label"
            variant="h3"
            component="h3"
            mb={2}
            sx={{ fontSize: '1rem' }}
          >
            Size: {localOptions.size}px
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Decrease size">
              <span>
                <IconButton
                  aria-label="Decrease QR code size"
                  size={isMobile ? 'small' : 'medium'}
                  onClick={() => handleZoom('out')}
                  disabled={localOptions.size <= 128}
                >
                  <ZoomOut fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </span>
            </Tooltip>
            <StyledSlider
              id="size-slider"
              aria-labelledby="size-slider-label"
              value={localOptions.size}
              min={128}
              max={1024}
              step={32}
              onChange={(_, value) => handleOptionChange({ size: value })}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}px`}
              marks={
                isMobile
                  ? undefined
                  : [
                      { value: 128, label: '128px' },
                      { value: 512, label: '512px' },
                      { value: 1024, label: '1024px' },
                    ]
              }
            />
            <Tooltip title="Increase size">
              <span>
                <IconButton
                  aria-label="Increase QR code size"
                  size={isMobile ? 'small' : 'medium'}
                  onClick={() => handleZoom('in')}
                  disabled={localOptions.size >= 1024}
                >
                  <ZoomIn fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>

        <Box>
          <Typography
            id="color-picker-label"
            variant="h3"
            component="h3"
            mb={2}
            sx={{ fontSize: '1rem' }}
          >
            Colors
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Change QR code color">
              <span>
                <ColorButton
                  color={localOptions.fgColor}
                  onClick={e => handleColorClick(e, 'fg')}
                  aria-label="Change QR code color"
                  aria-describedby="color-picker-label"
                >
                  <Palette
                    fontSize={isMobile ? 'small' : 'medium'}
                    sx={{
                      color: luminance(localOptions.fgColor) > 0.5 ? '#000' : '#fff',
                    }}
                  />
                </ColorButton>
              </span>
            </Tooltip>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Change background color">
                <span>
                  <ColorButton
                    color={localOptions.bgColor}
                    onClick={e => handleColorClick(e, 'bg')}
                    aria-label="Background color"
                    sx={{
                      opacity: localOptions.bgColor === 'transparent' ? 0.5 : 1,
                      background:
                        localOptions.bgColor === 'transparent'
                          ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                          : localOptions.bgColor,
                    }}
                  >
                    <Palette
                      fontSize={isMobile ? 'small' : 'medium'}
                      sx={{
                        color: luminance(localOptions.bgColor) > 0.5 ? '#000' : '#fff',
                      }}
                    />
                  </ColorButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  localOptions.bgColor === 'transparent'
                    ? 'Make background solid'
                    : 'Make background transparent'
                }
              >
                <IconButton
                  size={isMobile ? 'small' : 'medium'}
                  onClick={() =>
                    handleOptionChange({
                      bgColor: localOptions.bgColor === 'transparent' ? '#ffffff' : 'transparent',
                    })
                  }
                  sx={{
                    color:
                      localOptions.bgColor === 'transparent'
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
                    },
                  }}
                >
                  <Opacity fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* New Logo Section */}
        <Box>
          <Typography
            id="logo-section-label"
            variant="h3"
            component="h3"
            mb={2}
            sx={{ fontSize: '1rem' }}
          >
            Custom Logo
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={localOptions.logoEnabled}
                  onChange={handleLogoToggle}
                  disabled={!localOptions.logoImage}
                  color="primary"
                />
              }
              label="Display Logo"
            />

            {localOptions.logoImage ? (
              <LogoPreview>
                <img src={localOptions.logoImage} alt="QR Code Logo" className="logo-preview" />
                <LogoActions className="logo-actions">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleRemoveLogo}
                    aria-label="Remove logo"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </LogoActions>
              </LogoPreview>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{
                  p: 2,
                  border: `1px dashed ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                Upload Logo
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
            )}

            {localOptions.logoImage && localOptions.logoEnabled && (
              <Box>
                <Typography id="logo-size-label" gutterBottom>
                  Logo Size: {localOptions.logoSize}%
                </Typography>
                <StyledSlider
                  value={localOptions.logoSize}
                  onChange={(_, value) => handleOptionChange({ logoSize: value })}
                  aria-labelledby="logo-size-label"
                  min={5}
                  max={15}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value}%`}
                />
              </Box>
            )}
          </Stack>
        </Box>

        <StyledPopover
          open={Boolean(colorAnchor)}
          anchorEl={colorAnchor}
          onClose={() => setColorAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {activeColor === 'fg' ? 'QR Code Color' : 'Background Color'}
            </Typography>
            {activeColor === 'bg' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 1,
                }}
              >
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
                    color:
                      localOptions.bgColor === 'transparent' ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Opacity fontSize="small" />
                </IconButton>
              </Box>
            )}
            <HexColorPicker
              id="hex-color-picker"
              aria-label={`${activeColor === 'fg' ? 'QR Code' : 'Background'} color picker`}
              color={activeColor === 'fg' ? localOptions.fgColor : localOptions.bgColor}
              onChange={color =>
                handleOptionChange({
                  [activeColor === 'fg' ? 'fgColor' : 'bgColor']: color,
                })
              }
            />
          </Stack>
        </StyledPopover>
      </Stack>
    </ControlPanel>
  );
});

QRControls.displayName = 'QRControls';

export default QRControls;
