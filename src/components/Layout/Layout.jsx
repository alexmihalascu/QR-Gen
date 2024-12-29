import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default',
      transition: 'background-color 0.3s ease'
    }}
  >
    <Header />
    <Container
      component="main"
      sx={{
        flex: 1,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '900px' },
        mx: 'auto',
        px: { xs: 2, sm: 3 }
      }}
    >
      {children}
    </Container>
    <Footer />
  </Box>
);

export default Layout;