# UDAAN - Rural Internship Platform

A mobile-first internship platform designed for rural and first-generation learners in India.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image manually
docker build -t udaan-app .
docker run -p 3000:80 udaan-app

# Access the app at http://localhost:3000
```

## 📱 Features

### Core Functionality
- **Smart Matching**: Algorithm-based internship recommendations
- **One-Click Apply**: Streamlined application process
- **Application Tracking**: Monitor all applications in one place
- **Bilingual Support**: English and Hindi interface
- **Low-Data Mode**: Optimized for rural internet connectivity

### Accessibility
- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- Large touch targets (48px minimum)

### Rural-Focused Features
- SMS/WhatsApp sharing
- Offline PDF generation
- Voice/TTS support (where available)
- Low-bandwidth optimizations

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Sample JSON datasets
└── mocks/              # API mocks
```

## 🤖 Recommendation Algorithm

The platform uses a lightweight scoring system:

1. **Hard Filters**: Education level, deadline validation
2. **Skill Matching**: Term overlap calculation (60% weight)
3. **Distance Scoring**: Haversine distance calculation (40% weight)
4. **Priority Boosts**: First-generation learners (+20%), Female candidates (+10%)

## 📊 Sample Data

- **internships.json**: 100+ sample internships
- **candidates.json**: 20+ sample profiles
- **i18n.json**: Bilingual text content

## 🧪 Testing Features

### Simulate User Journey
1. Visit home page
2. Click "Get Matched" → redirects to signup
3. Fill profile form with skills
4. View personalized recommendations
5. Apply to internships
6. Check application tracker

### Test Language Toggle
- Click globe icon in header
- Interface switches between English/Hindi

### Test Low-Data Features
- WhatsApp share buttons generate proper links
- PDF generation works client-side

## ✅ Acceptance Criteria

- [x] Profile creation saves to localStorage
- [x] Recommendations show match percentage
- [x] Apply flow creates application records
- [x] Language toggle works
- [x] Mobile-responsive design
- [x] Accessibility compliance

## 🔧 Configuration

### Priority Boosts
Edit recommendation weights in `src/utils/recommendations.js`:
- Skill match weight: 0.6
- Distance weight: 0.4
- First-gen boost: +0.2
- Gender boost: +0.1

## 📦 Dependencies

- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **jsPDF**: PDF generation

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Performance

- Lighthouse Score: >90 (mobile)
- Bundle size: <500KB gzipped
- First Contentful Paint: <2s
- Lazy loading for non-critical components

## 🔒 Privacy & Security

- No external API calls
- Data stored locally only
- No tracking or analytics
- GDPR-friendly design

## 🚀 Deployment

```bash
# Build production bundle
npm run build

# Deploy to any static hosting
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 📱 Mobile Testing

Test on actual devices or use browser dev tools:
- iPhone SE (375px width)
- Android (360px width)
- Tablet (768px width)

## 🤝 Contributing

1. Focus on accessibility and performance
2. Test on mobile devices
3. Maintain bilingual support
4. Keep bundle size minimal
5. Follow existing code patterns

## 📞 Support

For rural users with limited internet:
- SMS fallback options available
- Printable PDF applications
- WhatsApp integration for sharing
- Voice assistance (where supported)