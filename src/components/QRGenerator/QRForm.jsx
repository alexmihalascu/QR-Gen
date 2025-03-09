import styled from '@emotion/styled';
import {
  Email,
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  Link as LinkIcon,
  LocationOn,
  Lock,
  MyLocation,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
  Wifi,
} from '@mui/icons-material';
import {
  alpha,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { Map, Marker } from 'pigeon-maps';
import React, { useCallback, useEffect, useState } from 'react';

import {
  formatIncompletePhoneNumber,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';

const getFormattedCountries = () => {
  return getCountries()
    .map(country => ({
      code: country,
      label: new Intl.DisplayNames(['en'], { type: 'region' }).of(country),
      phone: getCountryCallingCode(country),
      flag: country
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
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
        getOptionLabel={option => `${option.flag} ${option.label} (+${option.phone})`}
        renderInput={params => <StyledInput {...params} label="Country" fullWidth />}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box component="span" sx={{ mr: 2 }}>
              {option.flag}
            </Box>
            {option.label} (+{option.phone})
          </Box>
        )}
      />
      <StyledInput
        label="Phone Number"
        value={localNumber}
        onChange={e => setLocalNumber(e.target.value.replace(/[^\d]/g, ''))}
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

const LocationForm = ({ data, onChange }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [center, setCenter] = useState([
    data?.lat ? Number(data.lat) : 44.42716,
    data?.lng ? Number(data.lng) : 26.10249,
  ]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMarkerDrag = async ({ anchor: [lat, lng] }) => {
    if (isOffline) {
      setError('Cannot fetch address details: No internet connection');
      return;
    }

    setLoading(true);
    setQuery('');
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      onChange({
        ...data,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: address || '',
      });
      setCenter([lat, lng]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch address details. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      setError('Location services require HTTPS. Please access this site via HTTPS.');
      return;
    }

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (isOffline) {
      setError('Cannot get location details: No internet connection');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await getAddressFromCoordinates(latitude, longitude);
          onChange({
            ...data,
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            address: address || '',
          });
          setCenter([latitude, longitude]);
          setError(null);
        } catch (err) {
          setError(
            'Got location but failed to fetch address details. Please check your internet connection.'
          );
        } finally {
          setLoading(false);
        }
      },
      error => {
        let errorMessage = 'Could not get location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions in your browser/device settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Request timed out.';
            break;
          default:
            errorMessage += error.message;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    if (!navigator.onLine) {
      throw new Error('No internet connection');
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          new URLSearchParams({
            format: 'json',
            lat: lat,
            lon: lng,
          })
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const result = await response.json();
      return result.display_name;
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      throw err;
    }
  };

  const handleMapClick = async ({ latLng: [lat, lng] }) => {
    if (isOffline) {
      setError('Cannot fetch address details: No internet connection');
      return;
    }

    setLoading(true);
    setQuery('');
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      onChange({
        ...data,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: address || '',
      });
      setCenter([lat, lng]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch address details. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const [previewUrl, setPreviewUrl] = useState('');

  const debouncedSearch = useCallback(
    debounce(async searchQuery => {
      if (searchQuery.length < 3) return;
      if (isOffline) {
        setError('Cannot search address: No internet connection');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              format: 'json',
              q: searchQuery,
              limit: 1,
            })
        );
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        const results = await response.json();

        if (results?.[0]) {
          const { lat, lon, display_name } = results[0];
          const newLat = Number(lat);
          const newLng = Number(lon);

          onChange({
            ...data,
            lat: newLat.toFixed(6),
            lng: newLng.toFixed(6),
            address: display_name,
          });

          setCenter([newLat, newLng]);
          setError(null);
        } else {
          setError('No results found for this address');
        }
      } catch (err) {
        setError('Failed to search location. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }, 1000),
    [onChange, data, setCenter, isOffline]
  );

  useEffect(() => {
    if (query.length >= 3) {
      debouncedSearch(query);
    }
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <Stack spacing={3}>
      <StyledInput
        label="Search Address"
        value={query}
        onChange={e => setQuery(e.target.value)}
        error={!!error}
        helperText={
          error ||
          (isOffline
            ? 'Currently offline - some features may be limited'
            : 'Enter at least 3 characters to search')
        }
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOn />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="outlined"
        onClick={getCurrentLocation}
        startIcon={<MyLocation />}
        disabled={loading}
        fullWidth
      >
        Use Current Location
      </Button>

      <Box
        sx={{
          width: '100%',
          height: 300,
          borderRadius: 2,
          overflow: 'hidden',
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Map defaultCenter={center} center={center} defaultZoom={11} onClick={handleMapClick}>
          <Marker
            width={50}
            color="#FF0000"
            anchor={[Number(data?.lat) || center[0], Number(data?.lng) || center[1]]}
            onClick={handleMapClick}
            draggable={true}
            onDragEnd={handleMarkerDrag}
          />
        </Map>
      </Box>

      <Stack direction="row" spacing={2}>
        <StyledInput
          label="Latitude"
          type="number"
          value={data?.lat || ''}
          onChange={e => onChange({ ...data, lat: e.target.value })}
          fullWidth
        />
        <StyledInput
          label="Longitude"
          type="number"
          value={data?.lng || ''}
          onChange={e => onChange({ ...data, lng: e.target.value })}
          fullWidth
        />
      </Stack>

      {data?.address && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            p: 1.5,
            borderRadius: 1,
            bgcolor: theme => alpha(theme.palette.background.paper, 0.5),
          }}
        >
          📍 {data?.address || 'No location selected'}
        </Typography>
      )}
    </Stack>
  );
};

const StyledInput = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),

    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },

    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
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
  },
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
  },
}));

const FormContainer = styled(motion.div)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
  backdropFilter: 'blur(12px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow:
    theme.palette.mode === 'dark'
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
  },
}));

const QRForm = ({ type, data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (type === 'wifi' && !data?.ssid) {
      onChange({
        ssid: '',
        password: '',
        encryption: 'WPA',
      });
    }
  }, [type]);

  const handleSocialClick = prefix => {
    const username = data.replace(
      /^(?:https?:\/\/)?((?:www\.)?(?:linkedin\.com\/in\/|instagram\.com\/|facebook\.com\/|github\.com\/))?/,
      ''
    );
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
          aria-label="GitHub Profile"
          bgcolor={theme.palette.mode === 'dark' ? '#333' : '#181717'}
          onClick={() => handleSocialClick('https://github.com/')}
          theme={theme}
        >
          <GitHub />
        </SocialButton>
      </Tooltip>
    </Stack>
  );

  const generateEventContent = data => {
    if (!data.title || !data.start || !data.end) return '';

    const eventData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${data.title}`,
      data.description ? `DESCRIPTION:${data.description}` : '',
      data.location ? `LOCATION:${data.location}` : '',
      `DTSTART:${formatDateTime(data.start)}Z`,
      `DTEND:${formatDateTime(data.end)}Z`,
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\n');

    return eventData;
  };

  const renderForm = () => {
    switch (type) {
      case 'wifi':
        return (
          <form onSubmit={e => e.preventDefault()}>
            <Stack spacing={3}>
              <StyledInput
                label="Network Name (SSID)"
                value={data.ssid || ''}
                onChange={e => onChange({ ...data, ssid: e.target.value })}
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
                onChange={e => onChange({ ...data, password: e.target.value })}
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                <InputLabel sx={{ color: theme.palette.text.secondary }}>Security Type</InputLabel>
                <StyledSelect
                  value={data.encryption || 'WPA'}
                  label="Security Type"
                  onChange={e => onChange({ ...data, encryption: e.target.value })}
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
              onChange={e => onChange(e.target.value)}
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
              onChange={e => onChange({ ...data, name: e.target.value })}
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
              onChange={e => onChange({ ...data, email: e.target.value })}
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
              onChange={phone => onChange({ ...data, phone })}
              fullWidth
            />
            <StyledInput
              label="Address"
              multiline
              rows={2}
              value={data.address || ''}
              onChange={e => onChange({ ...data, address: e.target.value })}
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
              onChange={e => onChange({ ...data, company: e.target.value })}
              fullWidth
            />
            <StyledInput
              label="Title"
              value={data.title || ''}
              onChange={e => onChange({ ...data, title: e.target.value })}
              fullWidth
            />
          </Stack>
        );
      }

      case 'phone':
        return <PhoneInput value={data || ''} onChange={onChange} fullWidth />;

      case 'sms':
        return (
          <Stack spacing={3}>
            <PhoneInput
              value={data?.phone || ''}
              onChange={phone => onChange({ ...data, phone })}
              fullWidth
            />
            <StyledInput
              label="Message"
              multiline
              rows={3}
              value={data?.message || ''}
              onChange={e => onChange({ ...data, message: e.target.value })}
              fullWidth
            />
          </Stack>
        );

      case 'event':
        return (
          <Stack spacing={3}>
            <StyledInput
              label="Event Title"
              value={data?.title || ''}
              onChange={e =>
                onChange({
                  ...data,
                  title: e.target.value,
                })
              }
              required
              fullWidth
            />
            <StyledInput
              label="Description"
              multiline
              rows={3}
              value={data?.description || ''}
              onChange={e =>
                onChange({
                  ...data,
                  description: e.target.value,
                })
              }
              fullWidth
            />
            <StyledInput
              label="Location"
              value={data?.location || ''}
              onChange={e =>
                onChange({
                  ...data,
                  location: e.target.value,
                })
              }
              fullWidth
            />
            <StyledInput
              label="Start Date/Time"
              type="datetime-local"
              value={data?.start || ''}
              onChange={e =>
                onChange({
                  ...data,
                  start: e.target.value,
                })
              }
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <StyledInput
              label="End Date/Time"
              type="datetime-local"
              value={data?.end || ''}
              onChange={e =>
                onChange({
                  ...data,
                  end: e.target.value,
                })
              }
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        );

      case 'geo':
        return <LocationForm data={data} onChange={onChange} />;

      default:
        return (
          <StyledInput
            label={
              type === 'email'
                ? 'Enter Email'
                : type === 'phone'
                ? 'Enter Phone Number'
                : 'Enter Text'
            }
            type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
            value={data}
            onChange={e => onChange(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {type === 'email' ? <Email /> : type === 'phone' ? <Phone /> : <Person />}
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
