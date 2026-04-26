-- file: events_rls_fix.sql
-- Run this in Supabase SQL Editor if events page is stuck loading
-- This explicitly grants anon access which is sometimes needed alongside RLS policies

-- 1. Drop and recreate policies to force refresh
DROP POLICY IF EXISTS "Allow public read events" ON events;
DROP POLICY IF EXISTS "Allow public insert registration" ON event_registrations;
DROP POLICY IF EXISTS "Allow public read registration" ON event_registrations;

CREATE POLICY "Allow public read events"
    ON events FOR SELECT USING (true);

CREATE POLICY "Allow public insert registration"
    ON event_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read registration"
    ON event_registrations FOR SELECT USING (true);

-- 2. Explicitly grant to anon and authenticated roles
GRANT SELECT ON events TO anon;
GRANT SELECT ON events TO authenticated;
GRANT INSERT ON event_registrations TO anon;
GRANT INSERT ON event_registrations TO authenticated;
GRANT SELECT ON event_registrations TO anon;
GRANT SELECT ON event_registrations TO authenticated;

-- 3. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
