
const generateUID = () => {
  return 'qr-' + Date.now() + '@qrgenerator.com';
};

const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  
  return [
    d.getUTCFullYear(),
    pad(d.getUTCMonth() + 1),
    pad(d.getUTCDate()),
    'T',
    pad(d.getUTCHours()),
    pad(d.getUTCMinutes()),
    '00'
  ].join('');
};

export const formatQRData = (type, data) => {
    if (!data) return '';
    
    switch (type) {
      case 'url':
        return typeof data === 'string' ? 
          (data.startsWith('http') ? data : `https://${data}`) : '';
        
      case 'wifi':
        if (!data?.ssid) return '';
        return `WIFI:T:${data.encryption};S:${data.ssid}${data.password ? `;P:${data.password}` : ''};H:false;;`;
        
      case 'email':
        return typeof data === 'string' ? `mailto:${data}` : '';
        
      case 'phone':
        return typeof data === 'string' ? `tel:${data}` : '';
        
      case 'vcard':
        return typeof data === 'object' ? formatVCard(data) : '';

      case 'sms':
        return `smsto:${data.phone}:${data.message}`;

      case 'event':
        if (!data?.title || !data?.start || !data?.end) return '';
        return [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//QR Generator//EN',
          'BEGIN:VEVENT',
          `UID:${generateUID()}`,
          `DTSTAMP:${formatDateTime(new Date())}Z`,
          `DTSTART:${formatDateTime(data.start)}Z`,
          `DTEND:${formatDateTime(data.end)}Z`,
          `SUMMARY:${data.title.replace(/[,;\\]/g, '\\$&')}`,
          data.description ? `DESCRIPTION:${data.description.replace(/[,;\\]/g, '\\$&')}` : '',
          data.location ? `LOCATION:${data.location.replace(/[,;\\]/g, '\\$&')}` : '',
          'END:VEVENT',
          'END:VCALENDAR'
        ].filter(Boolean).join('\r\n');
      
      case 'geo':
        return `geo:${data.lat},${data.lng}`;
        
      default:
        return typeof data === 'string' ? data : '';
    }
  };
  
  const formatVCard = (data) => {
    if (!data.name) return '';
    
    let vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.name}`,
    ];
  
    if (data.email) vcard.push(`EMAIL:${data.email}`);
    if (data.phone) vcard.push(`TEL:${data.phone}`);
    if (data.address) vcard.push(`ADR:;;${data.address}`);
    if (data.company) vcard.push(`ORG:${data.company}`);
    if (data.title) vcard.push(`TITLE:${data.title}`);
  
    vcard.push('END:VCARD');
  
    return vcard.join('\n');
  };
