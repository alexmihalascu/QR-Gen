import styled from '@emotion/styled';
import {
  CodeOutlined,
  ContentCopyOutlined,
  ImageOutlined,
  PictureAsPdfOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  Fade,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { AnimatePresence, motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import React, { useCallback, useState } from 'react';

// Enhanced styled button with animations and improved styling
const DownloadButton = styled(motion.button)(({ theme, format, isMobile }) => {
  const getColorByFormat = () => {
    const colors = {
      png: theme.palette.primary,
      svg: theme.palette.secondary,
      pdf: theme.palette.error,
      share: theme.palette.success,
      copy: theme.palette.info,
      download: theme.palette.warning,
    };
    return colors[format] || colors.png;
  };

  const color = getColorByFormat();

  return {
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(135deg, ${color.dark}, ${color.main})`
        : `linear-gradient(135deg, ${color.main}, ${color.light})`,
    border: 'none',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(isMobile ? 1 : 1.5),
    color: '#fff',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(isMobile ? 13 : 14),
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    width: '100%',
    height: isMobile ? 40 : 48,
    maxWidth: '100%',
    justifyContent: 'center',
    transition: theme.transitions.create(['transform', 'box-shadow', 'background', 'opacity'], {
      duration: 200,
    }),
    boxShadow: `0 4px 14px ${
      theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.4)'
        : `rgba(${parseInt(color.main.slice(1, 3), 16)},
                ${parseInt(color.main.slice(3, 5), 16)},
                ${parseInt(color.main.slice(5, 7), 16)}, 0.25)`
    }`,
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg,
                      rgba(255, 255, 255, 0.1),
                      rgba(255, 255, 255, 0))`,
      pointerEvents: 'none',
      zIndex: 1,
    },

    '&:hover:not(:disabled)': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${
        theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.5)'
          : `rgba(${parseInt(color.main.slice(1, 3), 16)},
                  ${parseInt(color.main.slice(3, 5), 16)},
                  ${parseInt(color.main.slice(5, 7), 16)}, 0.35)`
      }`,
      background:
        theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${color.main}, ${color.light})`
          : `linear-gradient(135deg, ${color.dark}, ${color.main})`,
    },

    '&:active:not(:disabled)': {
      transform: 'translateY(0)',
      boxShadow: `0 3px 10px ${
        theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : `rgba(${parseInt(color.main.slice(1, 3), 16)},
                  ${parseInt(color.main.slice(3, 5), 16)},
                  ${parseInt(color.main.slice(5, 7), 16)}, 0.2)`
      }`,
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
      background:
        theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.grey[800]}, ${theme.palette.grey[700]})`
          : `linear-gradient(135deg, ${theme.palette.grey[300]}, ${theme.palette.grey[400]})`,
      boxShadow: 'none',
    },

    '& svg': {
      fontSize: theme.typography.pxToRem(isMobile ? 18 : 20),
      color: 'inherit',
    },
  };
});

// Loading indicator component
const LoadingIndicator = ({ size = 20 }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <CircularProgress
      size={size}
      color="inherit"
      thickness={4}
      sx={{
        animationDuration: '0.8s',
      }}
    />
  </Box>
);

// Button animation variants
const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: index => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.07,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const QRDownload = ({ qrRef, qrData, options = {} }) => {
  const [loadingType, setLoadingType] = useState('');
  const [message, setMessage] = useState({ type: null, text: '' });
  const theme = useTheme();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const canShare = Boolean(navigator?.share);

  // Check if we're in desktop environment
  const isDesktop = !isMobile && !isIOS;

  const getFormattedInput = useCallback(data => {
    if (!data) return 'unknown';

    // Try to determine the data type and format filename accordingly
    if (data.includes(':')) {
      const [type, content] = data.split(':');

      switch (type) {
        case 'tel':
          return (content?.replace(/[^0-9+]/g, '') || 'unknown').substring(0, 20);
        case 'WIFI':
          const ssid = data.match(/S:(.*?);/)?.[1] || 'unknown';
          return ssid.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        case 'mailto':
          return (content?.split('@')?.[0]?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown').substring(
            0,
            20
          );
        case 'BEGIN':
          if (data.includes('VCARD')) {
            const name = data.match(/FN:(.*?)(?:\r?\n|$)/)?.[1] || 'unknown';
            return name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
          }
          return 'unknown';
        case 'http':
        case 'https':
          try {
            const url = new URL(data);
            return url.hostname
              .replace(/^www\./i, '')
              .replace(/[^a-zA-Z0-9]/g, '_')
              .substring(0, 20);
          } catch {
            return 'url';
          }
        default:
          // For other types, just use a basic approach
          return data.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      }
    } else {
      // Plain text or unknown format
      return data.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
    }
  }, []);

  const getFileName = useCallback(
    format => {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');

      // Identify content type for better file naming
      let type = 'text';
      if (qrData?.startsWith('tel:')) type = 'phone';
      else if (qrData?.startsWith('WIFI:')) type = 'wifi';
      else if (qrData?.startsWith('mailto:')) type = 'email';
      else if (qrData?.startsWith('BEGIN:VCARD')) type = 'vcard';
      else if (qrData?.match(/^https?:\/\//i)) type = 'url';
      else if (qrData?.startsWith('geo:')) type = 'location';
      else if (qrData?.startsWith('smsto:')) type = 'sms';
      else if (qrData?.startsWith('BEGIN:VCALENDAR')) type = 'event';

      const input = getFormattedInput(qrData);
      return `qr_${type}_${input}_${timestamp}.${format}`;
    },
    [qrData, getFormattedInput]
  );

  const svgToCanvas = useCallback(
    async (svg, size) => {
      if (!svg) {
        throw new Error('SVG element not found');
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      try {
        const canvas = document.createElement('canvas');
        const scale = window.devicePixelRatio || 1; // For high-DPI displays
        const ctx = canvas.getContext('2d');

        const img = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });

        // Use higher resolution for better quality
        canvas.width = size * scale;
        canvas.height = size * scale;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        // Enable anti-aliasing and high quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.fillStyle = options.bgColor || '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        return canvas;
      } finally {
        URL.revokeObjectURL(url);
      }
    },
    [options.bgColor]
  );

  const downloadSVG = useCallback(async () => {
    if (!qrRef.current) throw new Error('QR reference not found');

    const svg = qrRef.current.querySelector('svg');
    if (!svg) throw new Error('SVG element not found');

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const fileName = getFileName('svg');

    saveAs(blob, fileName);
  }, [qrRef, getFileName]);

  const copyToClipboard = useCallback(async () => {
    if (!qrRef.current || !qrData) {
      setMessage({ type: 'error', text: 'No QR data to copy' });
      return;
    }

    setLoadingType('copy');
    try {
      await navigator.clipboard.writeText(qrData);
      setMessage({ type: 'success', text: 'QR data copied to clipboard' });
    } catch (err) {
      console.error('Copy error:', err);
      setMessage({ type: 'error', text: 'Failed to copy QR data' });
    } finally {
      setLoadingType('');
    }
  }, [qrRef, qrData]);

  const downloadQR = useCallback(
    async format => {
      if (!qrRef.current || !qrData) {
        setMessage({ type: 'error', text: 'Generate a QR code first' });
        return;
      }

      setLoadingType(format);
      try {
        const svg = qrRef.current.querySelector('svg');
        const size = options?.size || 1024; // Use larger size for better quality
        const fileName = getFileName(format);

        switch (format) {
          case 'png': {
            const canvas = await svgToCanvas(svg, size);
            canvas.toBlob(blob => saveAs(blob, fileName), 'image/png', 1);
            break;
          }
          case 'svg': {
            await downloadSVG();
            break;
          }
          case 'pdf': {
            const canvas = await svgToCanvas(svg, size);
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
            });

            // Add title
            const title = `QR Code: ${qrData.substring(0, 30)}${qrData.length > 30 ? '...' : ''}`;
            pdf.setFontSize(16);
            pdf.text(title, 20, 20);

            // Add QR code
            const imgData = canvas.toDataURL('image/png', 1);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const imageSize = Math.min(pdfWidth - 2 * margin, pdfHeight - 2 * margin - 20);

            // Center the QR code
            const xPos = (pdfWidth - imageSize) / 2;
            pdf.addImage(imgData, 'PNG', xPos, 30, imageSize, imageSize);

            // Add data text at bottom
            pdf.setFontSize(10);
            const dataText = qrData.length > 80 ? qrData.substring(0, 80) + '...' : qrData;
            pdf.text(dataText, 20, pdfHeight - 20);

            // Add timestamp
            const timestamp = new Date().toLocaleString();
            pdf.setFontSize(8);
            pdf.text(`Generated: ${timestamp}`, pdfWidth - 60, pdfHeight - 10);

            pdf.save(fileName);
            break;
          }
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
        setMessage({ type: 'success', text: `Downloaded as ${format.toUpperCase()}` });
      } catch (err) {
        console.error('Download error:', err);
        setMessage({ type: 'error', text: `Failed to download as ${format.toUpperCase()}` });
      } finally {
        setLoadingType('');
      }
    },
    [qrRef, qrData, options?.size, getFileName, svgToCanvas, downloadSVG]
  );

  const handleShare = useCallback(async () => {
    if (!qrRef.current || !qrData) {
      setMessage({ type: 'error', text: 'Generate a QR code first' });
      return;
    }

    setLoadingType('share');
    try {
      const svg = qrRef.current.querySelector('svg');
      if (!svg) throw new Error('SVG element not found');

      const canvas = await svgToCanvas(svg, options.size || 512);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));

      if (!blob) throw new Error('Failed to create image blob');

      const file = new File([blob], getFileName('png'), {
        type: 'image/png',
      });

      // Prepare share data
      const shareData = {
        title: 'QR Code',
        text: qrData.length > 50 ? qrData.substring(0, 50) + '...' : qrData,
        files: [file],
      };

      try {
        // Try sharing with files
        await navigator.share(shareData);
        setMessage({ type: 'success', text: 'Shared successfully!' });
      } catch (shareError) {
        // Fallback to URL only sharing
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: canvas.toDataURL('image/png'),
        });
        setMessage({ type: 'success', text: 'Shared successfully!' });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        setMessage({ type: 'error', text: 'Failed to share QR code' });
      }
    } finally {
      setLoadingType('');
    }
  }, [qrRef, qrData, options.size, getFileName, svgToCanvas]);

  const renderButton = (format, label, icon, onClick, index) => (
    <Tooltip
      key={`btn-${format}`}
      title={
        !!loadingType || !qrData
          ? ''
          : `${format === 'copy' ? 'Copy' : format === 'share' ? 'Share' : 'Download as'} ${label}`
      }
      arrow
      placement="top"
    >
      <Box sx={{ width: '100%' }}>
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={index}
        >
          <DownloadButton
            format={format}
            onClick={onClick}
            disabled={!!loadingType || !qrData}
            whileTap={{ scale: 0.95 }}
            isMobile={isMobile}
          >
            {loadingType === format ? <LoadingIndicator size={isMobile ? 16 : 20} /> : icon}
            {isMobile ? '' : label}
          </DownloadButton>
        </motion.div>
      </Box>
    </Tooltip>
  );

  const buttons = [
    { format: 'png', label: 'PNG', icon: <ImageOutlined />, onClick: () => downloadQR('png') },
    { format: 'svg', label: 'SVG', icon: <CodeOutlined />, onClick: () => downloadQR('svg') },
    {
      format: 'pdf',
      label: 'PDF',
      icon: <PictureAsPdfOutlined />,
      onClick: () => downloadQR('pdf'),
    },
    { format: 'copy', label: 'Copy Text', icon: <ContentCopyOutlined />, onClick: copyToClipboard },
  ];

  if (canShare) {
    buttons.push({
      format: 'share',
      label: 'Share',
      icon: <ShareOutlined />,
      onClick: handleShare,
    });
  }

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      {!qrData && (
        <Fade in={!qrData} timeout={800}>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{
              mb: 2,
              fontStyle: 'italic',
              opacity: 0.7,
            }}
          >
            Generate a QR code to enable download options
          </Typography>
        </Fade>
      )}

      <AnimatePresence>
        <Stack
          direction={{ xs: 'row', sm: 'row' }}
          spacing={isMobile ? 1 : 2}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing(isMobile ? 1 : 2),
            justifyContent: 'center',
            alignItems: 'center',
            '& > *': {
              flex: isMobile ? '0 0 calc(33.33% - 8px)' : '1 1 0',
              minWidth: isMobile ? 0 : 120,
            },
          }}
        >
          {buttons.map((button, index) =>
            renderButton(button.format, button.label, button.icon, button.onClick, index)
          )}
        </Stack>
      </AnimatePresence>

      <AnimatePresence>
        {message.text && (
          <Zoom in={!!message.text}>
            <Snackbar
              open={!!message.text}
              autoHideDuration={4000}
              onClose={() => setMessage({ type: null, text: '' })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                severity={message.type}
                variant="filled"
                sx={{
                  width: '100%',
                  boxShadow: theme.shadows[6],
                  borderRadius: theme.shape.borderRadius * 1.5,
                }}
                onClose={() => setMessage({ type: null, text: '' })}
              >
                {message.text}
              </Alert>
            </Snackbar>
          </Zoom>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default QRDownload;
