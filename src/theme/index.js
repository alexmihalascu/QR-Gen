import { createTheme, alpha } from '@mui/material';

const baseTheme = {
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', system-ui, -apple-system, sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2rem, 8vw, 2.5rem)',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.8rem, 6vw, 2rem)',
      lineHeight: 1.3
    },
    h5: {
      fontWeight: 600,
      fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 600,
      fontSize: 'clamp(1rem, 3vw, 1.25rem)',
      lineHeight: 1.5
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.5
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s, color 0.3s',
          minHeight: '100vh',
          scrollBehavior: 'smooth'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
          backdropFilter: 'blur(12px)',
          transition: theme.transitions.create([
            'background-color',
            'box-shadow',
            'border-color'
          ]),
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        })
      },
      variants: [
        {
          props: { variant: 'glass' },
          style: ({ theme }) => ({
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(16px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          })
        }
      ]
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          transition: theme.transitions.create([
            'background-color',
            'box-shadow',
            'border-color'
          ]),
          '&:hover': {
            backgroundColor: theme.palette.background.paper
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
          }
        })
      }
    }
  }
};
  
  export const lightTheme = createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: {
        main: '#2563eb',
        dark: '#1e40af',
        light: '#60a5fa',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
      }
    }
  });
  
  export const darkTheme = createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#60a5fa',
        dark: '#2563eb',
        light: '#93c5fd',
      },
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
      }
    }
  });