import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  alpha,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ThemeToggle from '../UI/ThemeToggle';

const LOGO_DIMENSIONS = {
  xs: 48,
  sm: 56,
  md: 64,
  lg: 72
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`
    : `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
  backdropFilter: 'blur(12px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
}));

const Logo = styled('img')(({ theme }) => ({
  height: 'auto',
  width: 'auto',
  marginRight: theme.spacing(1.5),
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
  }
}));
  
  const LogoSection = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: {
      xs: theme.spacing(1),
      sm: theme.spacing(1.5),
      md: theme.spacing(2)
    }
  }));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="sticky" component={motion.nav} initial={{ y: -100 }} animate={{ y: 0 }}>
    <Container maxWidth="xl">
      <Toolbar 
        disableGutters 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: {
            xs: 56,
            sm: 64,
            md: 70
          },
          px: {
            xs: 1,
            sm: 2,
            md: 3
          }
        }}
      >
        <LogoSection>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              duration: 1.8,
              bounce: 0.45,
              damping: 12
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
          <Typography 
            variant={isMobile ? 'h6' : 'h5'} 
            component={motion.h1}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ 
              fontWeight: 700,
              fontSize: {
                xs: '1.25rem',
                sm: '1.5rem',
                md: '1.75rem'
              },
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #82B1FF, #448AFF)'
                : 'linear-gradient(45deg, #1E88E5, #1565C0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            {isMobile ? 'QR Generator' : 'QR Code Generator'}
          </Typography>
        </LogoSection>
        <ThemeToggle />
      </Toolbar>
    </Container>
  </StyledAppBar>
  );
};

export default Header;