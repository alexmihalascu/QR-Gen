import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Tooltip,
  Box,
  useTheme,
  alpha,
  Autocomplete,
} from '@mui/material';
import {
  Wifi,
  Lock,
  Person,
  Phone,
  Email,
  LocationOn,
  Link as LinkIcon,
  Visibility,
  VisibilityOff,
  LinkedIn,
  Instagram,
  Facebook,
  GitHub,
} from '@mui/icons-material';

import { getCountries, getCountryCallingCode, formatIncompletePhoneNumber } from 'libphonenumber-js';

const getFormattedCountries = () => {
    return getCountries().map(country => ({
      code: country,
      label: new Intl.DisplayNames(['en'], { type: 'region' }).of(country),
      phone: getCountryCallingCode(country),
      flag: country.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(char.charCodeAt(0) + 127397)
      )
    })).sort((a, b) => a.label.localeCompare(b.label));
  };

  const PhoneInput = ({ value, onChange, fullWidth }) => {
    const [countries] = useState(getFormattedCountries());
    const [country, setCountry] = useState(countries.find(c => c.code === 'RO') || countries[0]);
    const [localNumber, setLocalNumber] = useState('');
    const theme = useTheme();
  
    useEffect(() => {
      const formattedNumber = formatIncompletePhoneNumber(localNumber, country.code);
      onChange(`+${country.phone}${localNumber}`);
    }, [country, localNumber, onChange]);

    return (
      <Stack spacing={2}>
        <Autocomplete
          options={countries}
          value={country}
          onChange={(_, newValue) => setCountry(newValue || countries[0])}
          getOptionLabel={(option) => `${option.flag} ${option.label} (+${option.phone})`}
          renderInput={(params) => (
            <StyledInput
              {...params}
              label="Country"
              fullWidth
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box component="span" sx={{ mr: 2 }}>{option.flag}</Box>
              {option.label} (+{option.phone})
            </Box>
          )}
        />
        <StyledInput
          label="Phone Number"
          value={localNumber}
          onChange={(e) => setLocalNumber(e.target.value.replace(/[^\d]/g, ''))}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
                <Box component="span" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                  +{country.phone}
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    );
  };

const StyledInput = styled(TextField)(({ theme }) => ({
    '.MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: 'blur(8px)',
      transition: theme.transitions.create([
        'background-color',
        'box-shadow',
        'border-color'
      ]),
      
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
      
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
      }
    },
    '.MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
    '.MuiOutlinedInput-input': {
      color: theme.palette.text.primary,
    },
    '.MuiInputAdornment-root': {
      color: theme.palette.text.secondary,
    },
    '.MuiIconButton-root': {
      color: theme.palette.text.secondary,
    }
  }));
  
  const SocialButton = styled(IconButton)(({ theme, bgcolor }) => ({
    background: bgcolor,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    transition: theme.transitions.create(['transform', 'box-shadow']),
    
    '&:hover': {
      background: bgcolor,
      transform: 'scale(1.1)',
      boxShadow: theme.shadows[4],
    }
  }));
  
  const FormContainer = styled(motion.div)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
    backdropFilter: 'blur(12px)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  }));
  
  const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    '& .MuiSelect-select': {
      color: theme.palette.text.primary,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.text.secondary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    }
  }));

const QRForm = ({ type, data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (type === 'wifi' && !data?.ssid) {
      onChange({
        ssid: '',
        password: '',
        encryption: 'WPA'
      });
    }
  }, [type]);

  const handleSocialClick = (prefix) => {
    const username = data.replace(/^(?:https?:\/\/)?((?:www\.)?(?:linkedin\.com\/in\/|instagram\.com\/|facebook\.com\/|github\.com\/))?/, '');
    onChange(prefix + username);
  };

  const renderSocialButtons = () => (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Tooltip title="LinkedIn Profile">
        <SocialButton
          size="small"
          bgcolor={theme.palette.mode === 'dark' ? '#0A66C2' : '#0077B5'}
          onClick={() => handleSocialClick('https://linkedin.com/in/')}
          theme={theme}
        >
          <LinkedIn />
        </SocialButton>
      </Tooltip>
      <Tooltip title="Instagram Profile">
        <SocialButton
          size="small"
          bgcolor={theme.palette.mode === 'dark' ? '#E1306C' : '#E4405F'}
          onClick={() => handleSocialClick('https://instagram.com/')}
          theme={theme}
        >
          <Instagram />
        </SocialButton>
      </Tooltip>
      <Tooltip title="Facebook Profile">
        <SocialButton
          size="small"
          bgcolor={theme.palette.mode === 'dark' ? '#1877F2' : '#1877F2'}
          onClick={() => handleSocialClick('https://facebook.com/')}
          theme={theme}
        >
          <Facebook />
        </SocialButton>
      </Tooltip>
      <Tooltip title="GitHub Profile">
        <SocialButton
          size="small"
          bgcolor={theme.palette.mode === 'dark' ? '#333' : '#181717'}
          onClick={() => handleSocialClick('https://github.com/')}
          theme={theme}
        >
          <GitHub />
        </SocialButton>
      </Tooltip>
    </Stack>
  );

  const renderForm = () => {
    switch (type) {
        case 'wifi':
        return (
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={3}>
            <StyledInput
                label="Network Name (SSID)"
                value={data.ssid || ''}
                onChange={(e) => onChange({ ...data, ssid: e.target.value })}
                fullWidth
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Wifi />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={data.password || ''}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                fullWidth
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.text.secondary }}>
                    Security Type
                </InputLabel>
                <StyledSelect
                    value={data.encryption || 'WPA'}
                    label="Security Type"
                    onChange={(e) => onChange({ ...data, encryption: e.target.value })}
                >
                    <MenuItem value="WPA">WPA/WPA2/WPA3</MenuItem>
                    <MenuItem value="WEP">WEP</MenuItem>
                    <MenuItem value="nopass">No Password</MenuItem>
                </StyledSelect>
                </FormControl>
            </Stack>
          </form>
        );

      case 'url':
        return (
          <Box>
            <StyledInput
              label="Enter URL"
              value={data}
              onChange={(e) => onChange(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
            {renderSocialButtons()}
          </Box>
        );

        case 'vcard': {
            return (
              <Stack spacing={3}>
                <StyledInput
                  label="Full Name"
                  value={data.name || ''}
                  onChange={(e) => onChange({ ...data, name: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledInput
                  label="Email"
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => onChange({ ...data, email: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <PhoneInput
                  value={data.phone || ''}
                  onChange={(phone) => onChange({ ...data, phone })}
                  fullWidth
                />
                <StyledInput
                  label="Address"
                  multiline
                  rows={2}
                  value={data.address || ''}
                  onChange={(e) => onChange({ ...data, address: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledInput
                  label="Company"
                  value={data.company || ''}
                  onChange={(e) => onChange({ ...data, company: e.target.value })}
                  fullWidth
                />
                <StyledInput
                  label="Title"
                  value={data.title || ''}
                  onChange={(e) => onChange({ ...data, title: e.target.value })}
                  fullWidth
                />
              </Stack>
            );
          }

          case 'phone':
            return (
                <PhoneInput
                    value={data || ''}
                    onChange={onChange}
                    fullWidth
                />
            );

      default:
        return (
          <StyledInput
            label={type === 'email' ? 'Enter Email' :
                  type === 'phone' ? 'Enter Phone Number' :
                  'Enter Text'}
            type={type === 'email' ? 'email' :
                  type === 'phone' ? 'tel' : 'text'}
            value={data}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {type === 'email' ? <Email /> :
                   type === 'phone' ? <Phone /> :
                   <Person />}
                </InputAdornment>
              ),
            }}
          />
        );
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderForm()}
    </FormContainer>
  );
};

export default QRForm;