import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ImageOutlined,
  CodeOutlined,
  PictureAsPdfOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

const DownloadButton = styled(motion.button)(({ theme, format }) => {
    const colors = {
        png: theme.palette.primary,
        svg: theme.palette.secondary,
        pdf: theme.palette.error,
        share: theme.palette.success
      };
  const color = colors[format] || colors.png;
    
  return {
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(45deg, ${color.dark}, ${color.main})`
      : `linear-gradient(45deg, ${color.main}, ${color.light})`,
    border: 'none',
    borderRadius: theme.shape.borderRadius * 1.5,
    padding: theme.spacing(1.5),
    color: '#fff',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%', 
    height: 48,
    maxWidth: '100%',
    justifyContent: 'center',
    transition: theme.transitions.create([
      'transform', 
      'box-shadow', 
      'background'
    ], {
      duration: 200
    }),
    boxShadow: theme.shadows[2],

    '&:hover:not(:disabled)': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
      background: theme.palette.mode === 'dark'
        ? `linear-gradient(45deg, ${color.main}, ${color.light})`
        : `linear-gradient(45deg, ${color.dark}, ${color.main})`,
    },

    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      background: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    },

    '& svg': {
      fontSize: theme.typography.pxToRem(20),
      color: 'inherit'
    }
  };
});

const QRDownload = ({ qrRef, qrData, options }) => {
  const [loadingType, setLoadingType] = useState('');
  const [message, setMessage] = useState({ type: null, text: '' });
  const theme = useTheme();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = useMediaQuery('(max-width:600px)');
  const canShare = Boolean(navigator?.share);

  const getFormattedInput = (data) => {
    if (!data) return 'unknown';

    // Extract type and content
    const type = data.split(':')[0];
    const content = data.split(':')[1];

    switch (type) {
      case 'tel':
        return content?.replace(/[^0-9+]/g, '') || 'unknown';
      case 'WIFI':
        const ssid = content?.match(/S:(.*?);/)?.[1] || 'unknown';
        return ssid.replace(/[^a-zA-Z0-9]/g, '_');
      case 'mailto':
        return content?.split('@')?.[0]?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
      case 'BEGIN':
        if (data.includes('VCARD')) {
          const name = data.match(/FN:(.*?)(?:\r?\n|$)/)?.[1] || 'unknown';
          return name.replace(/[^a-zA-Z0-9]/g, '_');
        }
        return 'unknown';
      case 'http':
      case 'https':
        return data.replace(/^https?:\/\//i, '')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .slice(0, 30);
      default:
        return data.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
    }
  };

  const getFileName = (format) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    
    // Determine type from data content
    let type = 'text';
    if (qrData?.startsWith('tel:')) type = 'phone';
    else if (qrData?.startsWith('WIFI:')) type = 'wifi';
    else if (qrData?.startsWith('mailto:')) type = 'email';
    else if (qrData?.startsWith('BEGIN:VCARD')) type = 'vcard';
    else if (qrData?.startsWith('http')) type = 'url';

    const input = getFormattedInput(qrData);
    return `qr_${type}_${input}_${timestamp}.${format}`;
  };
  
  const svgToCanvas = async (svg, size) => {
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
  
      canvas.width = size;
      canvas.height = size;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, size, size);
      
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const downloadQR = async (format) => {
    if (!qrRef.current || !qrData) {
      setMessage({ type: 'error', text: 'Generate a QR code first' });
      return;
    }

    setLoadingType(format);
    try {
      const svg = qrRef.current.querySelector('svg');
      const size = options?.size || 512;
      const fileName = getFileName(format);

      switch (format) {
        case 'png': {
          const canvas = await svgToCanvas(svg, size);
          canvas.toBlob(blob => saveAs(blob, fileName), 'image/png', 1);
          break;
        }
        case 'pdf': {
          const canvas = await svgToCanvas(svg, size);
          const pdf = new jsPDF();
          const imgData = canvas.toDataURL('image/png', 1);
          const pdfWidth = 210;
          const pdfHeight = 297;
          const margin = 10;
          const imageSize = Math.min(pdfWidth - 2*margin, pdfHeight - 2*margin);
          pdf.addImage(imgData, 'PNG', margin, margin, imageSize, imageSize);
          pdf.save(fileName);
          break;
        }
      }
      setMessage({ type: 'success', text: `Downloaded as ${format.toUpperCase()}` });
    } catch (err) {
      console.error('Download error:', err);
      setMessage({ type: 'error', text: 'Failed to download QR code' });
    } finally {
      setLoadingType('');
    }
  };

  const handleShare = async () => {
    if (!qrRef.current) return;
  
    setLoadingType('share');
    try {
      const svg = qrRef.current.querySelector('svg');
      const canvas = await svgToCanvas(svg, options.size);
      const blob = await new Promise(resolve => 
        canvas.toBlob(resolve, 'image/png', 1)
      );
      
      const file = new File([blob], getFileName('png'), { 
        type: 'image/png'
      });

      const shareData = { 
        title: 'QR Code',
        text: 'Share QR Code',
        files: [file]
      };

      try {
        await navigator.share(shareData);
        setMessage({ type: 'success', text: 'Shared successfully!' });
      } catch (shareError) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: canvas.toDataURL('image/png')
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
  };

  const renderButton = (format, label, icon, onClick) => (
    <Tooltip 
      title={!!loadingType || !qrData ? '' : `Download ${label}`} 
      arrow
    >
      <span style={{ width: '100%' }}>
        <DownloadButton
          format={format}
          onClick={onClick}
          disabled={!!loadingType || !qrData}
          whileTap={{ scale: 0.95 }}
        >
          {loadingType === format ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            icon
          )}
          {label}
        </DownloadButton>
      </span>
    </Tooltip>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
          '& > *': {
            flex: '0 0 auto',
            width: { xs: '100%', sm: 'auto' }
          }
        }}
      >
        {renderButton('png', 'PNG', <ImageOutlined />, () => downloadQR('png'))}
        {renderButton('svg', 'SVG', <CodeOutlined />, () => downloadQR('svg'))}
        {renderButton('pdf', 'PDF', <PictureAsPdfOutlined />, () => downloadQR('pdf'))}
        {canShare && renderButton('share', 'Share', <ShareOutlined />, handleShare)}
      </Stack>

      <AnimatePresence>
        {message.text && (
          <Snackbar
            open={!!message.text}
            autoHideDuration={4000}
            onClose={() => setMessage({ type: null, text: '' })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity={message.type}
              variant="filled"
              sx={{ width: '100%' }}
              onClose={() => setMessage({ type: null, text: '' })}
            >
              {message.text}
            </Alert>
          </Snackbar>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default QRDownload;
