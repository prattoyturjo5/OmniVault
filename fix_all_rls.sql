-- OMNIVAULT PUBLIC ACCESS FIX
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Grant SELECT permission to the public (anon) role for all relevant tables
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.faculty TO anon;
GRANT SELECT ON public.students TO anon;
GRANT SELECT ON public.specializations TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.event_registrations TO anon;

-- 2. Create RLS Policies to allow public reading
-- We use "IF NOT EXISTS" logic conceptually (DROP then CREATE) to ensure clean application

DO $$ 
BEGIN
    -- Courses
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow Public Read" ON public.courses;
    CREATE POLICY "Allow Public Read" ON public.courses FOR SELECT USING (true);

    -- Faculty
    ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow Public Read" ON public.faculty;
    CREATE POLICY "Allow Public Read" ON public.faculty FOR SELECT USING (true);

    -- Students
    ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow Public Read" ON public.students;
    CREATE POLICY "Allow Public Read" ON public.students FOR SELECT USING (true);

    -- Specializations
    ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow Public Read" ON public.specializations;
    CREATE POLICY "Allow Public Read" ON public.specializations FOR SELECT USING (true);

    -- Events
    ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow Public Read" ON public.events;
    CREATE POLICY "Allow Public Read" ON public.events FOR SELECT USING (true);

END $$;

-- Verify results:
-- Go to your home page and refresh. The stats should now show real numbers instead of 0!
