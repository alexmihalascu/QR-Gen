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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`
      : `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
    backdropFilter: 'blur(12px)',
    boxShadow: 'none',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
  }));

const Logo = styled('img')(({ theme }) => ({
    height: {
      xs: 38,
      sm: 42,
      md: 46,
      lg: 50
    },
    width: {
      xs: 38,
      sm: 42,
      md: 46,
      lg: 50
    },
    marginRight: {
      xs: theme.spacing(1),
      sm: theme.spacing(1.5),
      md: theme.spacing(2)
    },
    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none',
    transition: theme.transitions.create(['transform', 'filter'], {
      duration: theme.transitions.duration.shorter
    }),
    '&:hover': {
      transform: {
        xs: 'scale(1.1) rotate(5deg)',
        sm: 'scale(1.15) rotate(10deg)'
      }
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
              src="/assets/favicon.ico"
              alt="QR Generator"
              component={motion.img}
              whileHover={{ 
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.4 }
              }}
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