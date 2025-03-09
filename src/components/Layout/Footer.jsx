import { GitHub, LinkedIn } from '@mui/icons-material';
import {
  alpha,
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React from 'react';

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: theme.transitions.create(['color', 'transform'], {
    duration: 0.3,
  }),
  position: 'relative',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    bottom: '-4px',
    left: '0',
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create('width', {
      duration: 0.3,
    }),
  },
  '&:hover::after': {
    width: '100%',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: '12px',
  padding: '8px',
  transition: theme.transitions.create(['transform', 'color', 'background', 'box-shadow'], {
    duration: 0.3,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const HeartIcon = styled(motion.span)({
  display: 'inline-block',
  transform: 'translateY(1px)',
});

const FooterContainer = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0)}, ${alpha(
          theme.palette.background.paper,
          0.95
        )})`
      : `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0)}, ${alpha(
          theme.palette.background.paper,
          0.9
        )})`,
  backdropFilter: 'blur(10px)',
  // Removed the borderTop property
  position: 'relative',
  // Removed the ::before pseudo-element with the top line
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer
      component="footer"
      sx={{
        py: { xs: 4, md: 5 },
        px: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                letterSpacing: '0.2px',
                lineHeight: 1.6,
              }}
            >
              Made with{' '}
              <HeartIcon
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                ❤️
              </HeartIcon>{' '}
              by{' '}
              <FooterLink
                href="https://mhlsq.ro"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&::after': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                MHLSQ SOFTWARE
              </FooterLink>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Stack direction="row" spacing={2}>
              <SocialButton
                href="https://github.com/alexmihalascu"
                target="_blank"
                rel="noopener noreferrer"
                component={motion.button}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <GitHub fontSize="small" />
              </SocialButton>
              <SocialButton
                href="https://linkedin.com/in/alexandrumihalascu"
                target="_blank"
                rel="noopener noreferrer"
                component={motion.button}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LinkedIn fontSize="small" />
              </SocialButton>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontWeight: 400, letterSpacing: '0.4px' }}
            >
              © {currentYear} QRGenerator. All rights reserved.
            </Typography>
          </motion.div>
        </Stack>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
