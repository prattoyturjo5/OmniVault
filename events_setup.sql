-- file: events_setup.sql
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Workshop',           -- Workshop, Seminar, Cultural, etc.
    description TEXT,
    event_date DATE,
    event_time TEXT,                        -- e.g. "10:00 AM"
    location TEXT,
    seats_total INTEGER DEFAULT 50,
    seats_remaining INTEGER DEFAULT 50,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    event_title TEXT,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_id TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 3. ENABLE RLS
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLICIES — EVENTS
-- ============================================
DROP POLICY IF EXISTS "Allow public read events" ON events;
DROP POLICY IF EXISTS "Allow admin insert events" ON events;
DROP POLICY IF EXISTS "Allow admin update events" ON events;
DROP POLICY IF EXISTS "Allow admin delete events" ON events;

CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow admin insert events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update events" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete events" ON events FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 5. POLICIES — EVENT REGISTRATIONS
-- ============================================
DROP POLICY IF EXISTS "Allow public insert registration" ON event_registrations;
DROP POLICY IF EXISTS "Allow public read registration" ON event_registrations;
DROP POLICY IF EXISTS "Allow admin delete registration" ON event_registrations;

CREATE POLICY "Allow public insert registration" ON event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read registration" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "Allow admin delete registration" ON event_registrations FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 6. SEED INITIAL EVENTS
-- ============================================
INSERT INTO events (title, type, description, event_date, event_time, location, seats_total, seats_remaining, is_featured)
VALUES
  ('OmniVault Annual DevCon', 'Conference', 'The biggest gathering of developers and researchers. Focus on LLM architecture, hardware-software co-design, and the future of distributed cloud systems. Join us for keynote sessions from industry giants.', '2025-08-20', '9:00 AM', 'OmniVault Main Auditorium', 300, 300, true),
  ('React Native Bootcamp', 'Workshop', 'Hands-on application development building comprehensive cross-platform applications natively over frameworks. Full technical resources will be provided.', '2025-10-12', '10:00 AM', 'Lab 402, CSE Wing', 60, 60, false),
  ('Ethics in AI & Automation', 'Seminar', 'A profound discussion targeting algorithmic bias and the social impact of automated decision systems. Moderated by Dr. Fahmida Chowdhury.', '2025-10-18', '2:00 PM', 'CSE Lounge, North Wing', 80, 80, false),
  ('Open Source Showcase', 'Cultural', 'Displaying student contributions to major repositories and celebrating the spirit of free software. Coding demos and project booths will be present throughout the weekend.', '2025-10-24', '11:00 AM', 'Main Campus Quad', 200, 200, false);
