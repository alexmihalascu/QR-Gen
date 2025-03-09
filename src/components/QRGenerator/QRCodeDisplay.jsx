import { alpha, Box, Fade, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import React, { forwardRef, useEffect, useState } from 'react';

// Styled components for enhanced visual design
const StyledPaper = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.8)
      : theme.palette.background.paper,
  maxWidth: '100%',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.4)'
        : '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const QRContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  maxWidth: '100%',
  borderRadius: theme.shape.borderRadius,
  '& svg': {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    filter:
      theme.palette.mode === 'dark'
        ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))'
        : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.05))',
    transition: 'all 0.3s ease',
  },
}));

const LogoPreview = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  backgroundColor: 'background.paper',
  padding: theme.spacing(0.5),
  boxShadow: theme.shadows[1],
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '50%',
  },
}));

const QRCodeDisplay = forwardRef(({ data, options = {}, title, subtitle }, ref) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Default options with fallbacks
  const defaultOptions = {
    size: 256,
    level: 'H',
    bgColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
    fgColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    includeMargin: true,
    logoSize: 20,
    logoImage: null,
    logoEnabled: false,
    cornerRadius: 0,
  };

  // Merge provided options with defaults
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) return null;

  // Calculate logo size based on QR code size and percentage
  const logoSizePixels = Math.round(mergedOptions.size * (mergedOptions.logoSize / 100));

  // Get type label from data for display
  const getTypeLabel = () => {
    if (data.startsWith('http')) return 'URL';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('tel:')) return 'Phone';
    if (data.startsWith('WIFI:')) return 'WiFi';
    if (data.startsWith('BEGIN:VEVENT')) return 'Event';
    if (data.startsWith('geo:')) return 'Location';
    if (data.startsWith('BEGIN:VCARD')) return 'Contact';
    if (data.startsWith('SMSTO:')) return 'SMS';
    return 'Text';
  };

  // Determine if we should use the QRCode's built-in image support or our custom logo overlay
  const shouldUseBuiltInImage = mergedOptions.logoEnabled && mergedOptions.logoImage;

  return (
    <StyledPaper
      elevation={3}
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography
          variant="body2"
          color="textSecondary"
          gutterBottom
          align="center"
          sx={{ mb: 2 }}
        >
          {subtitle}
        </Typography>
      )}

      <Fade in={!isLoading} timeout={700}>
        <QRContainer
          sx={{
            bgcolor:
              mergedOptions.bgColor === 'transparent' ? 'transparent' : mergedOptions.bgColor,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <QRCodeSVG
            value={data}
            size={Math.min(mergedOptions.size, 1024)}
            level={mergedOptions.level || 'H'}
            bgColor={mergedOptions.bgColor}
            fgColor={mergedOptions.fgColor}
            includeMargin={mergedOptions.includeMargin}
            // Apply corner radius if specified
            style={{
              borderRadius: `${mergedOptions.cornerRadius}px`,
            }}
            // Adding imageSettings if logo is present and enabled
            imageSettings={
              shouldUseBuiltInImage
                ? {
                    src: mergedOptions.logoImage,
                    height: logoSizePixels,
                    width: logoSizePixels,
                    excavate: true,
                  }
                : undefined
            }
          />

          {/* Preview of logo in development mode or if explicitly requested */}
          {process.env.NODE_ENV === 'development' &&
            mergedOptions.logoImage &&
            mergedOptions.logoEnabled && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  p: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  zIndex: 10,
                  fontSize: '0.75rem',
                }}
              >
                {/* <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                  Logo Preview
                </Typography> */}
                {/* <Box
                  component="img"
                  src={mergedOptions.logoImage}
                  alt="Logo Preview"
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                /> */}
              </Box>
            )}
        </QRContainer>
      </Fade>

      {data && !isLoading && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 'medium',
              mb: 1,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
            }}
          >
            {getTypeLabel()}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: 'block',
              fontSize: '0.7rem',
              opacity: 0.7,
              maxWidth: '90%',
              mx: 'auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.length > 30 ? `${data.substring(0, 30)}...` : data}
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;
