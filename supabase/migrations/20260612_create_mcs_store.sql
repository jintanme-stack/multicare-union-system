-- SQL Migration: Create mcs_store key-value sync table
-- Created: 2026-06-12
-- Target Platform: Supabase / PostgreSQL

CREATE TABLE IF NOT EXISTS public.mcs_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mcs_store ENABLE ROW LEVEL SECURITY;

-- 1. SELECT policy: Allow anyone (both authenticated and anonymous) to read all rows.
-- This allows the application to sync global lists (like pending caregivers and active members) on any client device.
CREATE POLICY "Allow public select" ON public.mcs_store
    FOR SELECT USING (true);

-- 2. INSERT policy: Allow anyone to insert rows.
-- This allows new caregivers to insert their registration into the pending vetting list.
CREATE POLICY "Allow public insert" ON public.mcs_store
    FOR INSERT WITH CHECK (true);

-- 3. UPDATE policy: Allow anyone to update rows.
CREATE POLICY "Allow public update" ON public.mcs_store
    FOR UPDATE USING (true) WITH CHECK (true);

-- 4. DELETE policy: Allow anyone to delete rows.
CREATE POLICY "Allow public delete" ON public.mcs_store
    FOR DELETE USING (true);
