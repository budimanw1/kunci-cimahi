# KUNCI-CIMAHI

Tukang Kunci Terpercaya 24/7 di Cimahi Selatan - Bundaran Leuwigajah

## 🔑 About

KUNCI-CIMAHI adalah layanan tukang kunci profesional yang beroperasi 24/7 di area Cimahi Selatan, khususnya di sekitar Bundaran Leuwigajah. Kami menyediakan berbagai layanan kunci untuk motor, mobil, dan rumah dengan harga terjangkau dan teknisi berpengalaman.

## ✨ Features

- 🏠 **Homepage** - Hero section dengan CTA dan lokasi interaktif
- 🔧 **Services Page** - Daftar lengkap layanan dengan pricing table
- 📝 **Booking System** - Real-time booking dengan ticket ID generation
- 💬 **WhatsApp Integration** - Floating button dan auto-notification
- 📊 **Admin Dashboard** - Real-time booking management
- 🗺️ **Google Maps** - Lokasi terintegrasi
- ⭐ **Testimonials** - Carousel testimoni pelanggan
- 🔒 **Protected Routes** - Admin authentication dengan Supabase

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kunci-cimahi
   ```

2. **Install dependencies**
   
   Due to PowerShell execution policy restrictions, you may need to run:
   ```powershell
   # Run PowerShell as Administrator
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   
   Then install:
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the SQL scripts in `SUPABASE_SETUP.md`
   - Create an admin user through Supabase Dashboard

4. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_WHATSAPP_NUMBER=62xxxxxxxxxx
   NEXT_PUBLIC_BUSINESS_PHONE=+62 xxx xxxx xxxx
   NEXT_PUBLIC_SITE_URL=https://kunci-cimahi.vercel.app
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
kunci-cimahi/
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── login/         # Admin login page
│   │   └── page.tsx       # Dashboard page
│   ├── booking/           # Booking pages
│   │   ├── success/       # Success page
│   │   └── page.tsx       # Booking form
│   ├── contact/           # Contact page
│   ├── services/          # Services page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── booking-form.tsx   # Booking form component
│   ├── footer.tsx         # Footer component
│   ├── navbar.tsx         # Navigation bar
│   ├── service-card.tsx   # Service card component
│   ├── testimonial-carousel.tsx
│   └── whatsapp-button.tsx
├── lib/
│   ├── metadata.ts        # SEO metadata utilities
│   ├── supabase.ts        # Supabase client & utilities
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── middleware.ts          # Route protection
├── SUPABASE_SETUP.md      # Database setup guide
└── package.json
```

## 🔐 Admin Access

- **URL**: `/admin/login`
- **Default**: Create admin user through Supabase Dashboard
- **Features**: 
  - Real-time booking list
  - Status management
  - Revenue statistics

## 📱 WhatsApp Integration

The app integrates WhatsApp for:
- Customer inquiries (floating button)
- Booking notifications to technician
- Customer booking confirmations

## 🗺️ Google Maps

The embedded map shows the business location at Bundaran Leuwigajah. You can:
- Use the default embedded map (no API key needed)
- Add Google Maps API key for enhanced features

## 📊 Database Schema

See `SUPABASE_SETUP.md` for complete schema including:
- `bookings` - Customer bookings
- `services` - Service catalog
- `testimonials` - Customer reviews

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  gold: { ... },
  // Add your custom colors
}
```

### Services

Update services in Supabase `services` table or modify the homepage service grid.

### Testimonials

Add testimonials through Supabase `testimonials` table.

## 🐛 Troubleshooting

### PowerShell Execution Policy Error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Build Errors

```bash
npm run build
```

Check for TypeScript errors and fix them.

## 📄 License

MIT License - feel free to use this project for your own locksmith business!

## 🤝 Support

For support, contact:
- WhatsApp: [Your WhatsApp Number]
- Email: [Your Email]

---

Built with ❤️ for KUNCI-CIMAHI
