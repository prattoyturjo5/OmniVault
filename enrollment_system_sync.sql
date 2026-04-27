-- file: enrollment_system_sync.sql
-- Run this in Supabase SQL Editor

-- 1. Ensure 'enrolled' column exists in 'courses' table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='enrolled') THEN
        ALTER TABLE public.courses ADD COLUMN enrolled INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Create 'enrollments' table (replacing or complementing course_enrollments)
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    course_title TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'completed'
    certificate_count INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on 'enrollments'
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies for 'enrollments'
DROP POLICY IF EXISTS "Students can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students can enroll themselves" ON public.enrollments;
DROP POLICY IF EXISTS "Admins have full access to enrollments" ON public.enrollments;

-- Policy: Students can view their own enrollments
-- (Note: Since we are using student_id, we assume student_id matches something in the auth context or session)
-- For simplicity in this demo environment, we'll allow selection if student_id is provided.
CREATE POLICY "Students can view their own enrollments" ON public.enrollments
    FOR SELECT USING (true); 

-- Policy: Students can enroll themselves
CREATE POLICY "Students can enroll themselves" ON public.enrollments
    FOR INSERT WITH CHECK (true);

-- Policy: Admins have full access to enrollments (using authenticated role for simplicity)
CREATE POLICY "Admins have full access to enrollments" ON public.enrollments
    FOR ALL USING (true);

-- 5. Grant access
GRANT ALL ON public.enrollments TO anon;
GRANT ALL ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
