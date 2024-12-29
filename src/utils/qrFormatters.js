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