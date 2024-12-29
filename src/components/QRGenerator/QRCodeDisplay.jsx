import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Paper, Box } from '@mui/material';

const QRCodeDisplay = forwardRef(({ data, options }, ref) => {
  if (!data) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.paper',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      <Box 
        ref={ref} 
        sx={{ 
          p: 2, 
          bgcolor: options.bgColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '100%',
          '& svg': {
            maxWidth: '100%',
            height: 'auto',
            display: 'block'
          }
        }}
      >
        <QRCodeSVG
        value={data}
        size={Math.min(options.size, 1024)}
        level={options.level}
        bgColor={options.bgColor}
        fgColor={options.fgColor}
        includeMargin={options.includeMargin}
        />
      </Box>
    </Paper>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;