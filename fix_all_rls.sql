-- file: fix_all_rls.sql
-- Run this in Supabase SQL Editor to fix "0" on homepage and "Loading" on events page

-- 1. Enable RLS on all tables (just in case they are not)
ALTER TABLE IF EXISTS courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS specializations ENABLE ROW LEVEL SECURITY;

-- 2. Create Public Read Policies for all tables
-- COURSES
DROP POLICY IF EXISTS "Public Read Courses" ON courses;
CREATE POLICY "Public Read Courses" ON courses FOR SELECT USING (true);

-- FACULTY
DROP POLICY IF EXISTS "Public Read Faculty" ON faculty;
CREATE POLICY "Public Read Faculty" ON faculty FOR SELECT USING (true);

-- STUDENTS
DROP POLICY IF EXISTS "Public Read Students" ON students;
CREATE POLICY "Public Read Students" ON students FOR SELECT USING (true);

-- EVENTS
DROP POLICY IF EXISTS "Public Read Events" ON events;
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);

-- REGISTRATIONS (Let public see counts, but maybe hide emails if privacy is needed. For now, allow read for simplicity)
DROP POLICY IF EXISTS "Public Read Registrations" ON event_registrations;
CREATE POLICY "Public Read Registrations" ON event_registrations FOR SELECT USING (true);

-- SPECIALIZATIONS
DROP POLICY IF EXISTS "Public Read Specializations" ON specializations;
CREATE POLICY "Public Read Specializations" ON specializations FOR SELECT USING (true);

-- 3. Explicitly Grant Permissions to anon and authenticated roles
-- This ensures the database engine itself allows the connection before RLS is even checked
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Also allow public to insert registrations (if they want to register)
GRANT INSERT ON event_registrations TO anon;
GRANT INSERT ON event_registrations TO authenticated;

-- 4. Reload PostgREST to refresh schema cache
NOTIFY pgrst, 'reload schema';
