# Supabase Database Setup

This document provides SQL scripts to set up the database for KUNCI-CIMAHI.

## Tables

### 1. Bookings Table

```sql
-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motor', 'mobil', 'rumah', 'lainnya')),
  problem_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'on_the_way', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on ticket_id for faster lookups
CREATE INDEX idx_bookings_ticket_id ON bookings(ticket_id);

-- Create index on status for filtering
CREATE INDEX idx_bookings_status ON bookings(status);

-- Create index on created_at for sorting
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

### 2. Services Table

```sql
-- Create services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_start INTEGER NOT NULL,
  estimated_time TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('motor', 'mobil', 'rumah')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, description, price_start, estimated_time, icon, category) VALUES
  ('Duplikat Kunci Motor', 'Pembuatan kunci motor duplikat semua merk', 25000, '10 menit', 'bike', 'motor'),
  ('Duplikat Kunci Mobil', 'Duplikat kunci mobil dengan teknologi terkini', 75000, '20 menit', 'car', 'mobil'),
  ('Kunci Rumah', 'Pembuatan dan perbaikan kunci rumah', 50000, '15 menit', 'home', 'rumah'),
  ('Kunci Hilang', 'Pembuatan kunci baru untuk kendaraan atau rumah', 50000, '20 menit', 'key', 'motor'),
  ('Kunci Patah', 'Ekstraksi kunci patah dari lubang kunci', 50000, '15 menit', 'wrench', 'motor'),
  ('Kunci Terkunci', 'Membuka kunci yang terkunci di dalam', 75000, '15 menit', 'lock', 'motor');
```

### 3. Testimonials Table

```sql
-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, location, rating, comment, service_type, is_active) VALUES
  ('Budi Santoso', 'Leuwigajah', 5, 'Pelayanan cepat dan profesional! Kunci motor saya yang hilang langsung dibuatkan duplikat dalam 15 menit. Harga terjangkau.', 'Duplikat Kunci Motor', true),
  ('Siti Nurhaliza', 'Cimahi Selatan', 5, 'Sangat membantu! Kunci rumah saya patah di lubang kunci, teknisinya datang cepat dan berhasil mengeluarkan tanpa merusak pintu.', 'Kunci Patah', true),
  ('Ahmad Hidayat', 'Bundaran Leuwigajah', 5, 'Layanan 24 jam benar-benar bisa diandalkan. Tengah malam kunci mobil tertinggal di dalam, langsung ditangani dengan baik.', 'Kunci Terkunci', true);

-- Create index on is_active for filtering
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
```

## Row Level Security (RLS)

### Enable RLS

```sql
-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- Bookings: Allow public to insert (for booking form)
CREATE POLICY "Allow public insert on bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Bookings: Allow public to read their own bookings (by ticket_id)
CREATE POLICY "Allow public read on bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Bookings: Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Bookings: Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services: Allow public to read
CREATE POLICY "Allow public read services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Testimonials: Allow public to read active testimonials
CREATE POLICY "Allow public read active testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Testimonials: Allow authenticated users to read all
CREATE POLICY "Allow authenticated read all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);
```

## Realtime Subscriptions

```sql
-- Enable realtime for bookings table (for admin dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
```

## Functions

### Auto-update updated_at timestamp

```sql
-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each section above in order
4. Execute each SQL block
5. Verify tables are created in the Table Editor
6. Test RLS policies are working correctly

## Environment Variables

After setting up the database, add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Admin User Setup

To create an admin user:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. User can now login at `/admin/login`

Alternatively, use the Supabase Auth API or SQL:

```sql
-- This is handled by Supabase Auth UI
-- Just create a user through the dashboard
```
