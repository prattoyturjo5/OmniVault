-- file: specializations_setup.sql

-- 1. Create Specializations Table
CREATE TABLE IF NOT EXISTS specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tag TEXT, -- e.g. "AI & ML", "Security"
    description TEXT,
    course_count INTEGER DEFAULT 0,
    faculty_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "Allow public read specializations" ON specializations;
DROP POLICY IF EXISTS "Allow admin insert specializations" ON specializations;
DROP POLICY IF EXISTS "Allow admin update specializations" ON specializations;
DROP POLICY IF EXISTS "Allow admin delete specializations" ON specializations;

CREATE POLICY "Allow public read specializations" ON specializations FOR SELECT USING (true);
CREATE POLICY "Allow admin insert specializations" ON specializations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update specializations" ON specializations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete specializations" ON specializations FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Insert Initial Data
INSERT INTO specializations (title, tag, description, course_count, faculty_count)
VALUES 
('Artificial Intelligence', 'AI & ML', 'Pushing the boundaries of neural networks and autonomous systems.', 12, 15),
('Software Engineering', 'DevOps', 'Building robust, scalable, and secure cloud-native architectures.', 15, 20),
('Cybersecurity', 'Security', 'Defending global infrastructure against advanced persistent threats.', 8, 10);
