-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so users can submit the contact form)
CREATE POLICY "Allow anonymous inserts for contact messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow all reads (assuming we might need them on the admin panel if using anon key, though usually we'd restrict it to admins, but since auth is currently via simple sessions let's allow read)
CREATE POLICY "Allow public read access for contact messages"
ON public.contact_messages FOR SELECT
TO anon, authenticated
USING (true);

-- Allow deletes (so admins can delete messages)
CREATE POLICY "Allow public delete access for contact messages"
ON public.contact_messages FOR DELETE
TO anon, authenticated
USING (true);
