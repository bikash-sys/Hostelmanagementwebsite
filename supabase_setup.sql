-- ============================================================
-- DormDesk Hostel Management System — Supabase Setup Script
-- Run this entire file in your Supabase SQL Editor ONCE.
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. PROFILES TABLE (stores student/manager roles & approval status)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'student', -- 'student' | 'manager'
  status     TEXT NOT NULL DEFAULT 'approved', -- 'approved' | 'pending' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on profiles" ON profiles;
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. ROOMS TABLE (hostel rooms added by admin)
CREATE TABLE IF NOT EXISTS rooms (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT,
  price       NUMERIC,
  capacity    INTEGER,
  available   BOOLEAN DEFAULT true,
  amenities   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on rooms" ON rooms;
CREATE POLICY "Allow all on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

-- 3. BOOKINGS TABLE (room bookings by students)
CREATE TABLE IF NOT EXISTS bookings (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email   TEXT NOT NULL,
  guest_name   TEXT NOT NULL,
  room_name    TEXT NOT NULL,
  room_id      UUID REFERENCES rooms(id) ON DELETE SET NULL,
  check_in     TEXT,
  check_out    TEXT,
  months       TEXT[], -- e.g. ['June', 'July']
  total_price  NUMERIC,
  status       TEXT DEFAULT 'confirmed',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on bookings" ON bookings;
CREATE POLICY "Allow all on bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);

-- 4. COMPLAINTS TABLE (complaints filed by students)
CREATE TABLE IF NOT EXISTS complaints (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  room_no    TEXT,
  usn        TEXT,
  category   TEXT,
  context    TEXT,
  date       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on complaints" ON complaints;
CREATE POLICY "Allow all on complaints" ON complaints FOR ALL USING (true) WITH CHECK (true);

-- 5. LAUNDRY_REQUESTS TABLE (laundry pickup requests by students)
CREATE TABLE IF NOT EXISTS laundry_requests (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT NOT NULL,
  room_name  TEXT NOT NULL,
  type       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'booked'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE laundry_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on laundry_requests" ON laundry_requests;
CREATE POLICY "Allow all on laundry_requests" ON laundry_requests FOR ALL USING (true) WITH CHECK (true);

-- 6. ROOM_SERVICES TABLE (housekeeping/cleaning requests by students)
CREATE TABLE IF NOT EXISTS room_services (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_email TEXT NOT NULL,
  room_name  TEXT NOT NULL,
  type       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'under process' | 'done'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE room_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on room_services" ON room_services;
CREATE POLICY "Allow all on room_services" ON room_services FOR ALL USING (true) WITH CHECK (true);

-- 7. MESS_MENU TABLE (daily menu set by manager)
CREATE TABLE IF NOT EXISTS mess_menu (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal       TEXT UNIQUE NOT NULL, -- 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'
  time       TEXT,
  items      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE mess_menu ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on mess_menu" ON mess_menu;
CREATE POLICY "Allow all on mess_menu" ON mess_menu FOR ALL USING (true) WITH CHECK (true);

-- Insert default mess menu (only if empty)
INSERT INTO mess_menu (meal, time, items) VALUES
  ('Breakfast', '7:30 AM – 9:00 AM', 'Idli, Dosa, Poha, Bread & Eggs, Tea/Coffee'),
  ('Lunch',     '12:30 PM – 2:00 PM', 'Rice, Dal, Sabzi, Roti, Curd, Salad'),
  ('Snacks',    '4:30 PM – 5:30 PM',  'Samosa, Tea, Biscuits'),
  ('Dinner',    '7:30 PM – 9:00 PM',  'Rice, Dal, Paneer/Chicken, Roti, Sweet')
ON CONFLICT (meal) DO NOTHING;

-- ============================================================
-- Done! All 7 tables created with open RLS policies.
-- ============================================================
