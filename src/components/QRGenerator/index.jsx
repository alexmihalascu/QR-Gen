import React, { useState, useRef, useMemo } from 'react';
import { Container, Box, Tabs, Tab, useTheme, useMediaQuery, Stack } from '@mui/material';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { formatQRData } from '../../utils/qrFormatters';
import { 
  Link as LinkIcon, 
  TextFields, 
  Email, 
  Phone, 
  Wifi, 
  Language 
} from '@mui/icons-material';


import QRForm from './QRForm';
import QRControls from './QRControls';
import QRCodeDisplay from './QRCodeDisplay';
import QRDownload from './QRDownload';

const GlassContainer = styled(motion.div)(({ theme }) => ({
    background: theme.palette.mode === 'dark' 
      ? 'rgba(30, 41, 59, 0.7)'
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  }));

const ContentWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: 900px) {
    grid-template-columns: minmax(300px, 1fr) 400px;
  }
`;

const PreviewSection = styled(motion.div)`
  @media (min-width: 900px) {
    position: sticky;
    top: 32px;
    height: fit-content;
  }
`;

const PreviewCard = styled(motion.div)(({ theme }) => ({
    background: theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.8)'
      : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  }));

  const StyledTabs = styled(Tabs)(({ theme }) => ({
    '.MuiTabs-flexContainer': {
      gap: 8
    },
    '.MuiTab-root': {
      minHeight: 48,
      minWidth: 'auto',
      padding: '12px 24px',
      borderRadius: 12,
      textTransform: 'none',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      color: theme.palette.text.primary,
      
      '&.Mui-selected': {
        background: theme.palette.mode === 'dark'
          ? 'rgba(96, 165, 250, 0.15)'
          : 'rgba(25, 118, 210, 0.08)',
        color: theme.palette.primary.main,
      },
      
      '&:hover': {
        background: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.04)',
      }
    }
  }));

const QRGenerator = () => {
    const [activeTab, setActiveTab] = useState('url');
    const [qrData, setQRData] = useState('');
    const qrRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [qrOptions, setQROptions] = useState({
      size: 512,
      level: 'H',
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      includeMargin: true,
    });
  
    const handleTabChange = (_, newValue) => {
      setActiveTab(newValue);

      switch (newValue) {
        case 'wifi':
          setQRData({
            ssid: '',
            password: '',
            encryption: 'WPA'
          });
          break;
        case 'vcard':
          setQRData({
            name: '',
            email: '',
            phone: '',
            address: '',
            company: '',
            title: ''
          });
          break;
        default:
          setQRData('');
      }
    };
  
    const handleDataChange = (newData) => {
      setQRData(newData);
    };
  
    const formattedQRData = useMemo(() => {
      return formatQRData(activeTab, qrData);
    }, [activeTab, qrData]);
  
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <GlassContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ mb: 4 }}
          >
            <Tab icon={<LinkIcon />} label="URL" value="url" />
            <Tab icon={<TextFields />} label="Text" value="text" />
            <Tab icon={<Email />} label="Email" value="email" />
            <Tab icon={<Phone />} label="Phone" value="phone" />
            <Tab icon={<Wifi />} label="WiFi" value="wifi" />
            <Tab icon={<Language />} label="vCard" value="vcard" />
          </StyledTabs>
  
          <ContentWrapper>
            <Stack spacing={3}>
              <QRForm
                type={activeTab}
                data={qrData}
                onChange={handleDataChange}
              />
              <QRControls
                options={qrOptions}
                onChange={setQROptions}
                qrRef={qrRef}
                qrData={formattedQRData}
              />
            </Stack>
  
            <PreviewSection>
              <PreviewCard
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <QRCodeDisplay
                  ref={qrRef}
                  data={formattedQRData}
                  options={qrOptions}
                />
                <QRDownload
                  qrRef={qrRef}
                  qrData={formattedQRData}
                  options={qrOptions}
                />
              </PreviewCard>
            </PreviewSection>
          </ContentWrapper>
        </GlassContainer>
      </Container>
    );
  };
  
  export default QRGenerator;