# KUNCI-CIMAHI - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies

Due to PowerShell restrictions on Windows, first enable script execution:

```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:

```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL and anon key

### Step 3: Run Database Setup

1. In Supabase Dashboard, go to SQL Editor
2. Open `SUPABASE_SETUP.md` in this project
3. Copy and run each SQL block in order:
   - Create tables (bookings, services, testimonials)
   - Enable RLS
   - Create policies
   - Enable realtime
   - Create functions

### Step 4: Create Admin User

1. In Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email: `admin@kunci-cimahi.com`
4. Enter password: (your secure password)
5. Save the credentials

### Step 5: Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_BUSINESS_PHONE=+62 812 3456 7890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test the Application

1. **Homepage**: Check all sections load correctly
2. **Booking**: Submit a test booking
3. **Admin**: Login at `/admin/login` with your credentials
4. **WhatsApp**: Click floating button (opens WhatsApp)

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Then deploy to production
vercel --prod
```

## 📝 Next Steps

1. **Customize Content**:
   - Update business phone number
   - Add real testimonials in Supabase
   - Update Google Maps coordinates

2. **Branding**:
   - Add your logo to `/public`
   - Customize colors in `tailwind.config.js`

3. **SEO**:
   - Update metadata in `lib/metadata.ts`
   - Add og-image.jpg to `/public`

## 🆘 Common Issues

**PowerShell Error**: Run as Administrator and set execution policy

**Supabase Connection**: Check environment variables are correct

**Build Errors**: Run `npm run build` to see detailed errors

## 📞 Need Help?

Check `README.md` for detailed documentation or open an issue.

---

**Congratulations!** 🎉 Your locksmith website is ready!
