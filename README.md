# SportLink

Bu proje, spor etkinliklerini yönetmek ve takip etmek için geliştirilmiş bir web uygulamasıdır.

## Teknoloji Yığını

### Temel Teknolojiler
- **TypeScript**: Ana programlama dili
- **Next.js 15.3.0**: Server-side rendering ve routing için React framework'ü
- **React 18.2.0**: UI library
- **Node.js**: JavaScript runtime

### Frontend
- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn UI**: Component sistemi
- **Lucide React**: Icon library
- **date-fns**: JavaScript date utility library
- **Recharts**: Data visualization için chart library
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Sonner**: Toast notifications

### UI Components
- **Radix UI**: Unstyled, accessible components:
  - Dialog, Dropdown menu, Alert dialog, Avatar
  - Checkbox, Label, Popover, Progress
  - Scroll area, Select, Separator, Slot, Tabs

### State Management ve Utilities
- **React Context API**: State management için
- **Custom Hooks**: Tekrar kullanılabilir logic için
- **clsx/tailwind-merge**: Conditional class yönetimi
- **js-cookie**: Cookie yönetimi

### Development Tools
- **ESLint 9**: Code linting
- **PostCSS**: CSS processing
- **tw-animate-css**: Tailwind için animasyon utilities

### Mimari
- **App Router**: Next.js App Router ile routing
- **Middleware**: Authentication ve route protection
- **Component-based Architecture**: Organize component yapısı
- **Mock Data Support**: Local testing için
- **Type-driven Development**: Kapsamlı type tanımlamaları

### Authentication
- **Cookie-based Authentication**: Middleware ile implemente edilmiş

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Lisans

[MIT](https://choosealicense.com/licenses/mit/)
