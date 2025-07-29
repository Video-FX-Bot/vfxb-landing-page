# VFXB Landing Page 🎬

> **AI-Powered Video Creation Platform Landing Page**  
> Built with Next.js 15, TypeScript, and Motion for React

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.23.0-FF6B6B?style=flat-square)](https://motion.dev/)

## 🚀 Overview

VFXB is a cutting-edge AI-powered video creation platform that democratizes professional video production. This landing page showcases our innovative features, testimonials, and provides an engaging user experience with smooth animations and modern design.

### ✨ Key Features

- **🎯 AI-Powered Video Creation** - Advanced AI algorithms for automated video generation
- **🎨 Professional Templates** - Extensive library of customizable video templates
- **⚡ Real-time Processing** - Lightning-fast video rendering and processing
- **📱 Responsive Design** - Optimized for all devices and screen sizes
- **🔒 Enterprise Security** - SOC 2 compliant with enterprise-grade security
- **🌐 Global CDN** - Worldwide content delivery for optimal performance

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - Latest React features and optimizations

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **Lucide React** - Beautiful icon library
- **Motion for React** - Smooth animations and transitions

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Static type checking

## 📁 Project Structure

```
vfxb/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── blocks/             # Page sections
│   │   │   ├── coming-soon/    # Coming soon sections
│   │   │   ├── demo-section/   # Demo and video sections
│   │   │   ├── feature-sections/ # Feature showcases
│   │   │   ├── testimonials/   # Customer testimonials
│   │   │   └── use-cases/      # Use case demonstrations
│   │   ├── hero/               # Hero section components
│   │   ├── layout/             # Layout components
│   │   ├── navigation/         # Navigation components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utility functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.ts          # TailwindCSS configuration
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Video-FX-Bot/vfxb-landing-page.git
   cd vfxb-landing-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🎨 Design System

### Color Palette
- **Primary**: Modern gradient blues and purples
- **Secondary**: Complementary accent colors
- **Neutral**: Carefully crafted grays for text and backgrounds
- **Success/Error**: Semantic colors for feedback

### Typography
- **Headings**: DM Sans - Bold, modern sans-serif
- **Body**: Inter - Highly readable for all content
- **Code**: JetBrains Mono - Monospace for technical content

### Spacing
- **Grid System**: 8pt base grid for consistent spacing
- **Breakpoints**: Mobile-first responsive design
- **Components**: Modular spacing system

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### TailwindCSS

Custom configuration in `tailwind.config.ts`:
- Extended color palette
- Custom animations
- Component-specific utilities
- Responsive breakpoints

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Performance Optimizations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and images
- **Bundle Analysis**: Optimized bundle sizes

## 🎭 Animations

### Motion for React
- **Smooth Transitions**: Page and component transitions
- **Scroll Animations**: Reveal animations on scroll
- **Hover Effects**: Interactive micro-animations
- **Loading States**: Engaging loading animations

### Performance Considerations
- **Reduced Motion**: Respects user preferences
- **Hardware Acceleration**: GPU-optimized animations
- **Frame Rate**: 60fps smooth animations

## 🧪 Testing

### Type Safety
```bash
npm run type-check   # TypeScript compilation check
```

### Code Quality
```bash
npm run lint         # ESLint code analysis
```

### Build Verification
```bash
npm run build        # Production build test
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project from GitHub
   - Configure build settings
   - Set environment variables

2. **Automatic Deployments**
   - Push to main branch triggers deployment
   - Preview deployments for pull requests
   - Custom domains and SSL

### Build Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## 📊 Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Analysis
- **JavaScript Bundle**: Optimized for performance
- **CSS Bundle**: Purged unused styles
- **Image Assets**: WebP format with fallbacks

## 🔒 Security

### Best Practices
- **Content Security Policy**: Configured headers
- **HTTPS Only**: Secure connections enforced
- **Dependency Scanning**: Regular security updates
- **Input Validation**: Sanitized user inputs

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and commit**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📝 Recent Updates

### v1.0.0 - Initial Release
- ✅ Complete landing page implementation
- ✅ TypeScript migration and error resolution
- ✅ Motion animations integration
- ✅ Responsive design optimization
- ✅ Performance optimizations
- ✅ SEO enhancements

### Key Improvements
- **TypeScript Errors**: Resolved all compilation errors
- **Animation System**: Migrated from Framer Motion to Motion for React
- **Component Architecture**: Modular and reusable components
- **Performance**: Optimized bundle size and loading times

## 🐛 Known Issues

- None currently reported

## 📞 Support

### Documentation
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **TailwindCSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Motion**: [motion.dev/docs](https://motion.dev/docs)

### Contact
- **Issues**: [GitHub Issues](https://github.com/Video-FX-Bot/vfxb-landing-page/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Video-FX-Bot/vfxb-landing-page/discussions)

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ by the VFXB Team**

*Transforming video creation through the power of AI*
