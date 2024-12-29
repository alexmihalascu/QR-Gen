import { useState, useCallback } from 'react';

const defaultOptions = {
  size: 256,
  level: 'H',
  bgColor: '#FFFFFF',
  fgColor: '#000000',
  includeMargin: true,
};

export const useQRCode = () => {
  const [qrData, setQRData] = useState('');
  const [qrOptions, setQROptions] = useState(defaultOptions);

  const updateQRData = useCallback((newData) => {
    setQRData(newData);
  }, []);

  const updateQROptions = useCallback((newOptions) => {
    setQROptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const formatQRData = useCallback((type, data) => {
    switch (type) {
      case 'url':
        return data.startsWith('http') ? data : `https://${data}`;
      case 'wifi':
        return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
      case 'email':
        return `mailto:${data}`;
      case 'phone':
        return `tel:${data}`;
      case 'vcard':
        return formatVCard(data);
      case 'calendar':
        return formatCalendar(data);
      case 'location':
        return `geo:${data.latitude},${data.longitude}`;
      default:
        return data;
    }
  }, []);

  return {
    qrData,
    qrOptions,
    updateQRData,
    updateQROptions,
    formatQRData,
  };
};

const formatVCard = (data) => {
  return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TEL:${data.phone}
EMAIL:${data.email}
ADR:;;${data.address}
END:VCARD`;
};

const formatCalendar = (data) => {
  return `BEGIN:VEVENT
SUMMARY:${data.title}
DTSTART:${data.startDate}
DTEND:${data.endDate}
DESCRIPTION:${data.description}
LOCATION:${data.location}
END:VEVENT`;
};