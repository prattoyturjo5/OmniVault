-- file: stats_admin_setup.sql

-- 1. Remove sample data from previous script
DELETE FROM faculty;
DELETE FROM students;

-- 2. Ensure RLS is enabled
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any to avoid duplicates
DROP POLICY IF EXISTS "Allow public read faculty" ON faculty;
DROP POLICY IF EXISTS "Allow public read students" ON students;
DROP POLICY IF EXISTS "Allow admin insert faculty" ON faculty;
DROP POLICY IF EXISTS "Allow admin update faculty" ON faculty;
DROP POLICY IF EXISTS "Allow admin delete faculty" ON faculty;
DROP POLICY IF EXISTS "Allow admin insert students" ON students;
DROP POLICY IF EXISTS "Allow admin update students" ON students;
DROP POLICY IF EXISTS "Allow admin delete students" ON students;

-- 4. Create Public Read Policies
CREATE POLICY "Allow public read faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);

-- 5. Create Admin Write Policies (Authenticated users only)
CREATE POLICY "Allow admin insert faculty" ON faculty FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update faculty" ON faculty FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete faculty" ON faculty FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete students" ON students FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Create Course Enrollments Table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT NOT NULL,
    course_title TEXT,
    student_id TEXT NOT NULL,
    student_name TEXT,
    student_email TEXT,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public insert enrollment" ON course_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read enrollment" ON course_enrollments FOR SELECT USING (true);
CREATE POLICY "Allow admin delete enrollment" ON course_enrollments FOR DELETE USING (auth.role() = 'authenticated');
