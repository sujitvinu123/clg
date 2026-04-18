-- ============================================
-- Supabase Schema: internships table
-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the internships table
CREATE TABLE IF NOT EXISTS internships (
  id          uuid          PRIMARY KEY DEFAULT uuid_generate_v4(),
  company     text          NOT NULL,
  role        text,
  title       text          NOT NULL,
  location    text,
  duration    text,
  stipend     text,
  openings    integer       DEFAULT 0,
  skills      text[]        DEFAULT '{}',
  description text,
  deadline    date,
  created_at  timestamptz   DEFAULT now()
);

-- Disable RLS for development (open access)
ALTER TABLE internships DISABLE ROW LEVEL SECURITY;

-- Grant public access for anon key usage
GRANT ALL ON internships TO anon;
GRANT ALL ON internships TO authenticated;

-- Optional: Add RLS policies instead of disabling RLS
-- Uncomment below if you prefer RLS enabled:
--
-- ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Allow public read" ON internships
--   FOR SELECT USING (true);
--
-- CREATE POLICY "Allow public insert" ON internships
--   FOR INSERT WITH CHECK (true);
