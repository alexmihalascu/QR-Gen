# 🎨 QR-Gen
![QR-Gen](https://i.ibb.co/RTJQ7Hm/android-chrome-192x192.png)

**QR-Gen** is a modern Progressive Web App (PWA) for generating customizable QR codes. Built with **React** and **Material UI**, it offers a versatile platform for creating QR codes for various purposes including web links, events, locations, WiFi credentials, vCards, and more.

## ✨ Key Features

### 🎯 1. Multiple QR Code Types
- **Web Links**: Generate QR codes for websites and URLs with social media shortcuts
- **Plain Text**: Convert any text into a QR code
- **WiFi Credentials**: Create QR codes for easy network access
- **vCard**: Generate contact information QR codes
- **Phone Numbers**: Quick dial QR codes
- **SMS**: Generate QR codes for text messages
- **Events**: Create calendar events with full details
- **Locations**: Share specific locations with interactive map
- **Email**: Generate email QR codes

### 🗺️ 2. Map Integration
- **Interactive Map**: Select locations using Pigeon Maps
- **Geocoding**: Search for addresses and locations
- **Current Location**: Use device GPS for quick location sharing
- **Draggable Markers**: Fine-tune location selection
- **Address Display**: Show full address details

### 🎨 3. Customization Options
- **Full Color Control**: Customize both QR code and background colors
- **Transparency Support**: Create QR codes with transparent backgrounds
- **Design Flexibility**: Adjust size and style to match your needs

### 💾 4. Multiple Export Formats
- **PNG Export**: High-quality raster image export
- **SVG Export**: Scalable vector graphics for perfect quality at any size
- **PDF Export**: Professional document format
- **Direct Sharing**: Share via WhatsApp and other platforms

### 📱 5. Progressive Web App (PWA)
- **Install Anywhere**: Use on desktop or mobile without app store downloads
- **Offline Support**: Generate QR codes even without internet connection
- **Responsive Design**: Optimal experience across all devices

## 🔧 Technical Stack
- **React**: Frontend framework
- **Material UI**: UI components and theming
- **Emotion**: Styled components and CSS-in-JS
- **Framer Motion**: Animations and transitions
- **Pigeon Maps**: Interactive map integration
- **libphonenumber-js**: Phone number formatting
- **QRCode.react**: QR code generation
- **Vite**: Build tool and development server
- **Workbox**: PWA and service worker support

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alexmihalascu/QR-Gen.git
   cd QR-Gen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 💻 Development Commands
- `npm run dev`: Start development server
- `npm run dev:host`: Start development server with network access
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 🌐 [Live Demo](https://qr-gen-eosin-rho.vercel.app/)
Try QR-Gen live and experience all features firsthand!

## 🤝 Contributing
Contributions are welcome! Feel free to:
- Fork the repository
- Create a feature branch
- Submit pull requests
- Report issues
- Suggest improvements

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

## 📦 Key Dependencies
- **@mui/material & @mui/icons-material**: UI framework
- **pigeon-maps**: OpenStreetMap integration
- **libphonenumber-js**: Phone number handling
- **qrcode.react**: QR code generation
- **react-colorful**: Color picker
- **framer-motion**: Animations
- **file-saver**: File download handling
- **jspdf**: PDF generation