-- schema_patch_v4.sql
-- Fixes HTTP 400 errors across the dashboard by adding missing columns.

-- 1. Add the missing 'password' column to the students table for login authentication
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS password text;

-- 2. Add the missing 'student_email' column to course_enrollments table for fetching enrollments
ALTER TABLE public.course_enrollments
ADD COLUMN IF NOT EXISTS student_email text;

-- 3. Reset RLS (Row Level Security) to allow full public access for these tables (so registration and enrollment work smoothly)
DROP POLICY IF EXISTS "Enable full access for all users" ON public.students;
CREATE POLICY "Enable full access for all users" ON public.students
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access for all users" ON public.course_enrollments;
CREATE POLICY "Enable full access for all users" ON public.course_enrollments
  FOR ALL
  USING (true)
  WITH CHECK (true);
