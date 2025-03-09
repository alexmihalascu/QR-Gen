import { alpha, Box, Container, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';

// Background patterns with SVG
const BackgroundPatterns = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Top-right gradient blob */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.5], x: [50, 0], y: [-50, 0] }}
        transition={{ duration: 2, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          filter: 'blur(100px)',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            isDark ? 0.15 : 0.1
          )} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
          opacity: 0.5,
        }}
      />

      {/* Bottom-left gradient blob */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.6], x: [-50, 0], y: [50, 0] }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          filter: 'blur(120px)',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            isDark ? 0.15 : 0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
          opacity: 0.6,
        }}
      />

      {/* Subtle grid pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.05 : 0.025,
          backgroundImage: `radial-gradient(${alpha(
            theme.palette.text.primary,
            0.5
          )} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />
    </Box>
  );
};

// Main scroll progress indicator
const ScrollProgress = () => {
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentProgress = Math.min(window.scrollY / totalScroll, 1);
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (scrollProgress === 0) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${scrollProgress * 100}%`,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        zIndex: 2000,
        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
      }}
    />
  );
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.standard,
        }),
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <BackgroundPatterns />
      <AnimatePresence>
        <ScrollProgress />
      </AnimatePresence>

      <Header />

      <Container
        component={motion.main}
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        sx={{
          flex: 1,
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: '600px',
            md: '900px',
            lg: '1100px',
          },
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            backgroundImage: isDarkMode =>
              isDarkMode
                ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05), transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.03), transparent 60%)',
            borderRadius: '24px',
            padding: { xs: 2, sm: 3, md: 4 },
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 0 40px ${alpha(theme.palette.background.paper, 0.1)}`
                : `0 0 40px ${alpha(theme.palette.background.paper, 0.5)}`,
          }}
        >
          {children}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Layout;
