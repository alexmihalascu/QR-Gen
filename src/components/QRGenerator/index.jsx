import styled from '@emotion/styled';
import {
  Email,
  Event,
  History,
  Language,
  Link as LinkIcon,
  LocationOn,
  Phone,
  QrCode2,
  Settings,
  Sms,
  TextFields,
  Wifi,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  Fade,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatQRData } from '../../utils/qrFormatters';

import QRCodeDisplay from './QRCodeDisplay';
import QRControls from './QRControls';
import QRDownload from './QRDownload';
import QRForm from './QRForm';

const GlassContainer = styled(motion.div)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '32px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  border: `1px solid ${
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  }`,
}));

const PageHeader = styled(motion.div)`
  margin-bottom: 24px;
  text-align: center;
`;

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
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  border: `1px solid ${
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
  }`,
}));

// Improved StyledTabs with better mobile experience
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '.MuiTabs-flexContainer': {
    gap: 8,
    flexWrap: 'nowrap',
  },
  '.MuiTabs-scroller': {
    overflow: 'auto !important',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    // Prevent scroll behavior from being overridden
    scrollBehavior: 'smooth',
    overflowX: 'auto',
    maskImage: 'linear-gradient(to right, transparent, black 20px, black 80%, transparent 100%)',
    WebkitMaskImage:
      'linear-gradient(to right, transparent, black 20px, black 80%, transparent 100%)',
  },
  '.MuiTabs-indicator': {
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
  '.MuiTab-root': {
    minHeight: 48,
    minWidth: 'auto',
    padding: '10px 16px',
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    opacity: 0.8,

    '&.Mui-selected': {
      background:
        theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(25, 118, 210, 0.08)',
      color: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      opacity: 1,
    },

    '&:hover': {
      background:
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
      transform: 'translateY(-2px)',
      opacity: 1,
    },
  },
}));

// Tabs container with gradient edges for better UX
const TabsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginBottom: 24,
}));

const TabIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const HistoryChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const QRGenerator = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [qrData, setQRData] = useState('');
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const qrRef = useRef(null);
  const tabsRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [qrOptions, setQROptions] = useState({
    size: 512,
    level: 'H',
    bgColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#FFFFFF',
    fgColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    includeMargin: true,
    cornerRadius: 0,
    imageOverlay: null,
    logoScale: 0.2,
  });

  // Improved effect for scrolling to active tab
  useEffect(() => {
    if (tabsRef.current) {
      const tabsElement = tabsRef.current.querySelector('.MuiTabs-scroller');
      const activeTabElement = tabsElement?.querySelector('.Mui-selected');
      const tabsContainer = tabsRef.current;

      if (activeTabElement && tabsElement) {
        // Wait a moment for the tab layout to stabilize
        setTimeout(() => {
          const tabsRect = tabsElement.getBoundingClientRect();
          const activeTabRect = activeTabElement.getBoundingClientRect();
          const containerRect = tabsContainer.getBoundingClientRect();

          // Calculate the center position
          const scrollLeft =
            activeTabElement.offsetLeft - tabsRect.width / 2 + activeTabRect.width / 2;

          // Ensure scroll position is within bounds and smooth
          tabsElement.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }, [activeTab]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('qrHistory', JSON.stringify(history));
  }, [history]);

  // Update QR color options when theme changes
  useEffect(() => {
    setQROptions(prev => ({
      ...prev,
      bgColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#FFFFFF',
      fgColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
    }));
  }, [theme.palette.mode]);

  // Add to history when QR code is generated
  const addToHistory = (type, data) => {
    // Don't add empty data
    if (!data || (typeof data === 'object' && Object.values(data).every(val => !val))) return;

    const historyItem = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    // Limit history to 10 items and avoid duplicates
    setHistory(prev => {
      // Check if similar data already exists
      const existingItem = prev.find(
        item =>
          item.type === type &&
          (typeof data === 'string'
            ? item.data === data
            : JSON.stringify(item.data) === JSON.stringify(data))
      );

      if (existingItem) {
        // Move existing item to top with updated timestamp
        return [
          { ...existingItem, timestamp: new Date().toISOString() },
          ...prev.filter(item => item.id !== existingItem.id),
        ].slice(0, 10);
      }

      return [historyItem, ...prev].slice(0, 10);
    });
  };

  const loadFromHistory = item => {
    setActiveTab(item.type);
    setQRData(item.data);
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);

    switch (newValue) {
      case 'wifi':
        setQRData({
          ssid: '',
          password: '',
          encryption: 'WPA',
        });
        break;
      case 'vcard':
        setQRData({
          name: '',
          email: '',
          phone: '',
          address: '',
          company: '',
          title: '',
        });
        break;
      case 'sms':
        setQRData({
          phone: '',
          message: '',
        });
        break;
      case 'event':
        setQRData({
          title: '',
          location: '',
          start: '',
          end: '',
        });
        break;
      case 'geo':
        setQRData({
          lat: '',
          lng: '',
        });
        break;
      default:
        setQRData('');
    }
  };

  const handleDataChange = newData => {
    setQRData(newData);
  };

  const formattedQRData = useMemo(() => {
    return formatQRData(activeTab, qrData);
  }, [activeTab, qrData]);

  const handleGenerateClick = () => {
    if (formattedQRData) {
      addToHistory(activeTab, qrData);
    }
  };

  // Get icon for history item
  const getIconForType = type => {
    switch (type) {
      case 'url':
        return <LinkIcon fontSize="small" />;
      case 'text':
        return <TextFields fontSize="small" />;
      case 'email':
        return <Email fontSize="small" />;
      case 'phone':
        return <Phone fontSize="small" />;
      case 'sms':
        return <Sms fontSize="small" />;
      case 'wifi':
        return <Wifi fontSize="small" />;
      case 'event':
        return <Event fontSize="small" />;
      case 'geo':
        return <LocationOn fontSize="small" />;
      case 'vcard':
        return <Language fontSize="small" />;
      default:
        return <QrCode2 fontSize="small" />;
    }
  };

  // Get label for history item
  const getLabelForHistory = item => {
    const { type, data } = item;

    if (typeof data === 'string') return data.substring(0, 20) + (data.length > 20 ? '...' : '');

    switch (type) {
      case 'wifi':
        return data.ssid || 'WiFi';
      case 'vcard':
        return data.name || 'Contact';
      case 'sms':
        return data.phone || 'SMS';
      case 'event':
        return data.title || 'Event';
      case 'geo':
        return `${data.lat}, ${data.lng}` || 'Location';
      default:
        return type;
    }
  };

  // Get title for QR display based on active tab
  const getQRTitle = () => {
    switch (activeTab) {
      case 'url':
        return 'URL QR Code';
      case 'text':
        return 'Text QR Code';
      case 'email':
        return 'Email QR Code';
      case 'phone':
        return 'Phone QR Code';
      case 'sms':
        return 'SMS QR Code';
      case 'wifi':
        return 'WiFi Network QR Code';
      case 'event':
        return 'Event QR Code';
      case 'geo':
        return 'Location QR Code';
      case 'vcard':
        return 'Contact QR Code';
      default:
        return 'QR Code';
    }
  };

  // Get subtitle for QR display based on data
  const getQRSubtitle = () => {
    if (!qrData) return 'Fill the form to generate';

    if (typeof qrData === 'string') {
      return qrData.length > 30 ? `${qrData.substring(0, 30)}...` : qrData;
    }

    switch (activeTab) {
      case 'wifi':
        return qrData.ssid ? `Network: ${qrData.ssid}` : '';
      case 'vcard':
        return qrData.name ? qrData.name : '';
      case 'sms':
        return qrData.phone ? `To: ${qrData.phone}` : '';
      case 'event':
        return qrData.title ? qrData.title : '';
      case 'geo':
        return qrData.lat && qrData.lng ? `${qrData.lat}, ${qrData.lng}` : '';
      default:
        return '';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Fade in={true} timeout={800}>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #60a5fa, #a78bfa)'
                  : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            QR Code Generator
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 2 }}
          >
            Create customized QR codes for URLs, text, contact information, WiFi networks and more
          </Typography>
        </PageHeader>
      </Fade>

      <GlassContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Improved tabs container */}
        <TabsContainer ref={tabsRef}>
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="QR code type tabs"
            sx={{
              maxWidth: '100%',
              '.MuiTabs-flexContainer': {
                justifyContent: isMobile ? 'flex-start' : 'center',
              },
              ...(isMobile
                ? {}
                : {
                    '.MuiTabs-scroller': {
                      display: 'flex',
                      justifyContent: 'center',
                    },
                  }),
            }}
          >
            <Tab
              icon={
                <TabIcon>
                  <LinkIcon fontSize="small" />
                </TabIcon>
              }
              label="URL"
              value="url"
            />
            <Tab
              icon={
                <TabIcon>
                  <TextFields fontSize="small" />
                </TabIcon>
              }
              label="Text"
              value="text"
            />
            <Tab
              icon={
                <TabIcon>
                  <Email fontSize="small" />
                </TabIcon>
              }
              label="Email"
              value="email"
            />
            <Tab
              icon={
                <TabIcon>
                  <Phone fontSize="small" />
                </TabIcon>
              }
              label="Phone"
              value="phone"
            />
            <Tab
              icon={
                <TabIcon>
                  <Sms fontSize="small" />
                </TabIcon>
              }
              label="SMS"
              value="sms"
            />
            <Tab
              icon={
                <TabIcon>
                  <Wifi fontSize="small" />
                </TabIcon>
              }
              label="WiFi"
              value="wifi"
            />
            <Tab
              icon={
                <TabIcon>
                  <Event fontSize="small" />
                </TabIcon>
              }
              label="Event"
              value="event"
            />
            <Tab
              icon={
                <TabIcon>
                  <LocationOn fontSize="small" />
                </TabIcon>
              }
              label="Location"
              value="geo"
            />
            <Tab
              icon={
                <TabIcon>
                  <Language fontSize="small" />
                </TabIcon>
              }
              label="vCard"
              value="vcard"
            />
          </StyledTabs>
        </TabsContainer>

        {history.length > 0 && (
          <Box
            sx={{ mb: 4, px: 1 }}
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <History fontSize="small" />
              Recent QR Codes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {history.slice(0, 5).map((item, index) => (
                <Tooltip
                  key={item.id}
                  title={`Created: ${new Date(item.timestamp).toLocaleString()}`}
                  arrow
                  TransitionComponent={Zoom}
                >
                  <HistoryChip
                    icon={getIconForType(item.type)}
                    label={getLabelForHistory(item)}
                    onClick={() => loadFromHistory(item)}
                    variant="outlined"
                    size="small"
                    component={motion.div}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}

        <ContentWrapper>
          <Stack spacing={3}>
            <QRForm
              type={activeTab}
              data={qrData}
              onChange={handleDataChange}
              onGenerate={handleGenerateClick}
            />

            <Box>
              <Button
                startIcon={showAdvancedOptions ? null : <Settings fontSize="small" />}
                endIcon={showAdvancedOptions ? <Settings fontSize="small" /> : null}
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                variant="text"
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              >
                {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </Button>

              <Collapse in={showAdvancedOptions}>
                <QRControls
                  options={qrOptions}
                  onChange={setQROptions}
                  qrRef={qrRef}
                  qrData={formattedQRData}
                />
              </Collapse>
            </Box>
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
                title={getQRTitle()}
                subtitle={getQRSubtitle()}
              />

              <Divider sx={{ width: '80%', my: 2 }} />

              <QRDownload qrRef={qrRef} qrData={formattedQRData} options={qrOptions} />
            </PreviewCard>
          </PreviewSection>
        </ContentWrapper>
      </GlassContainer>
    </Container>
  );
};

export default QRGenerator;
