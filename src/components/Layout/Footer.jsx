import React from 'react';
import { Box, Typography, Link, Container, Stack, IconButton, useTheme, alpha } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';
import styled from '@emotion/styled';

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: theme.transitions.create(['color', 'transform']),
  '&:hover': {
    color: theme.palette.primary.main,
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(['transform', 'color', 'background']),
  '&:hover': {
    transform: 'translateY(-2px)',
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.1)
  }
}));

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0)}, ${alpha(theme.palette.background.paper, 0.8)})`
          : `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0)}, ${alpha(theme.palette.background.paper, 0.8)})`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2} alignItems="center">
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            divider={
              <Box 
                sx={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%',
                  bgcolor: 'text.disabled' 
                }} 
              />
            }
          >
            <Typography variant="body2" color="text.secondary">
              {'© '}
              <FooterLink href="/">
                QR Code Generator
              </FooterLink>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().getFullYear()}
            </Typography>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" align="center">
            Made with ❤️ by{' '}
            <FooterLink 
              href="https://alexandrumihalascu.tech" 
              target="_blank"
              rel="noopener noreferrer"
            >
              Alexandru Mihalașcu
            </FooterLink>
          </Typography>

          <Stack direction="row" spacing={1}>
            <SocialButton 
              href="https://github.com/alexmihalascu" 
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              <GitHub fontSize="small" />
            </SocialButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;