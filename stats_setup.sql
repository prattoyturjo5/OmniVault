-- file: stats_setup.sql

-- 1. Create Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    designation TEXT,
    department TEXT DEFAULT 'CSE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    enrollment_date DATE DEFAULT now(),
    department TEXT DEFAULT 'CSE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Allow public read faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);

-- 5. Insert Sample Data (Optional, but helps see the numbers)
INSERT INTO faculty (name, designation) VALUES 
('Dr. Alan Turing', 'Head of Department'),
('Dr. Grace Hopper', 'Professor'),
('Ada Lovelace', 'Assistant Professor'),
('John von Neumann', 'Associate Professor'),
('Margaret Hamilton', 'Lead Researcher');

-- Generate 120 fake students for demonstration
INSERT INTO students (name) SELECT 'Student ' || i FROM generate_series(1, 120) s(i);
