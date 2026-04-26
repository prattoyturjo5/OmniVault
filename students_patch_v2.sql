-- file: students_patch_v2.sql
-- Run this in your Supabase SQL Editor to fix the registration error.

-- 1. Add missing columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Update RLS to allow public registration (INSERT)
-- This is necessary for the registration form to work from the frontend
DROP POLICY IF EXISTS "Allow public insert students" ON students;
CREATE POLICY "Allow public insert students" ON students 
FOR INSERT 
WITH CHECK (true);

-- 3. Update existing policies for admin management
-- Allow public select for counters
DROP POLICY IF EXISTS "Allow public read students" ON students;
CREATE POLICY "Allow public read students" ON students 
FOR SELECT USING (true);

-- Allow all actions for authenticated admins (if needed, but simple insert for now)
DROP POLICY IF EXISTS "Allow all for authenticated" ON students;
CREATE POLICY "Allow all for authenticated" ON students 
USING (true)
WITH CHECK (true);

-- 4. Notify schema cache (in case of persistence issues)
NOTIFY pgrst, 'reload schema';
