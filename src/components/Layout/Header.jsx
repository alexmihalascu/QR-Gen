import {
  alpha,
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import ThemeToggle from '../UI/ThemeToggle';

const LOGO_DIMENSIONS = {
  xs: 40,
  sm: 48,
  md: 56,
  lg: 64,
};

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(to bottom, ${alpha(
          theme.palette.background.paper,
          scrolled ? 0.95 : 0.85
        )}, ${alpha(theme.palette.background.paper, scrolled ? 0.9 : 0.75)})`
      : `linear-gradient(to bottom, ${alpha(
          theme.palette.background.paper,
          scrolled ? 0.98 : 0.95
        )}, ${alpha(theme.palette.background.paper, scrolled ? 0.95 : 0.85)})`,
  backdropFilter: 'blur(20px)',
  boxShadow: scrolled
    ? `0 4px 20px ${alpha(theme.palette.mode === 'dark' ? '#000' : '#718096', 0.1)}`
    : 'none',
  borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.08 : 0.05)}`,
  transition: theme.transitions.create(['background', 'box-shadow', 'border-bottom'], {
    duration: theme.transitions.duration.standard,
  }),
}));

const Logo = styled('img')(({ theme }) => ({
  height: 'auto',
  width: 'auto',
  filter:
    theme.palette.mode === 'dark'
      ? 'drop-shadow(0 0 8px rgba(58, 134, 255, 0.3))'
      : 'drop-shadow(0 0 8px rgba(0, 82, 204, 0.2))',
  objectFit: 'contain',
  '@media (max-width: 600px)': {
    width: LOGO_DIMENSIONS.xs,
    height: LOGO_DIMENSIONS.xs,
  },
  '@media (min-width: 601px) and (max-width: 960px)': {
    width: LOGO_DIMENSIONS.sm,
    height: LOGO_DIMENSIONS.sm,
  },
  '@media (min-width: 961px) and (max-width: 1280px)': {
    width: LOGO_DIMENSIONS.md,
    height: LOGO_DIMENSIONS.md,
  },
  '@media (min-width: 1281px)': {
    width: LOGO_DIMENSIONS.lg,
    height: LOGO_DIMENSIONS.lg,
  },
}));

const LogoSection = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  position: 'relative',
  zIndex: 2,
}));

const LogoGlow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  filter: 'blur(15px)',
  opacity: 0.6,
  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(
    theme.palette.primary.main,
    0
  )} 70%)`,
  zIndex: 1,
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledAppBar
      position="sticky"
      component={motion.nav}
      scrolled={scrolled ? 1 : 0}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            minHeight: {
              xs: 64,
              sm: 72,
              md: 76,
            },
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <LogoSection>
            <Box
              position="relative"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <AnimatePresence>
                {logoHovered && (
                  <LogoGlow
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.6, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  duration: 1.5,
                  bounce: 0.5,
                  damping: 10,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: logoHovered ? [0, 5, -5, 0] : 0,
                  transition: {
                    scale: { duration: 0.2 },
                    rotate: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
                  },
                }}
              >
                <Logo
                  src="/assets/android-chrome-192x192.png"
                  srcSet={`
                    /assets/favicon-32x32.png 32w,
                    /assets/android-chrome-192x192.png 192w,
                    /assets/android-chrome-512x512.png 512w
                  `}
                  sizes="(max-width: 600px) 32px,
                        (max-width: 960px) 192px,
                        512px"
                  alt="QR Generator Logo"
                  aria-hidden="true"
                />
              </motion.div>
            </Box>

            {/* Text simplu QR Generator */}
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component={motion.h1}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: '1.3rem',
                  sm: '1.5rem',
                  md: '1.7rem',
                },
                color: theme.palette.text.primary,
                letterSpacing: '0.5px',
              }}
            >
              QR Generator
            </Typography>
          </LogoSection>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* <IconButton
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '12px',
                p: { xs: 0.8, sm: 1 },
                display: { xs: 'none', sm: 'flex' },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <QrCodeScannerIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton> */}
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
