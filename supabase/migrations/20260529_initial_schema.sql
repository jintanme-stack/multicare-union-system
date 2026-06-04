-- Initial PostgreSQL Database Migration: MultiCare Support Malaysia Union (MCSA)
-- Created: 2026-05-29
-- Target Platform: Supabase / PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TYPE ENUMS
-- =========================================================================
CREATE TYPE public.user_role AS ENUM ('super_admin', 'union_admin', 'member', 'customer', 'family_member');
CREATE TYPE public.member_category AS ENUM ('companion', 'confinement', 'elderly', 'rehab');
CREATE TYPE public.case_status AS ENUM ('pending_assignment', 'active', 'suspended', 'completed', 'cancelled');
CREATE TYPE public.profile_status AS ENUM ('pending_verification', 'active', 'expired', 'suspended');

-- =========================================================================
-- 2. TABLES DEFINITIONS
-- =========================================================================

-- Profiles (Linked to Supabase Auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'customer',
    status public.profile_status NOT NULL DEFAULT 'pending_verification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Union Members (Specific details for registered caregivers)
CREATE TABLE public.union_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    member_number TEXT UNIQUE, -- Format: MCSA-YYYY-XXXX (computed via trigger)
    category public.member_category NOT NULL,
    experience_years INT DEFAULT 0,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    license_fee_paid NUMERIC(10,2) DEFAULT 0.00,
    points INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.00,
    digital_card_url TEXT,
    bio TEXT
);

-- Clients
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- optional login link
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Family Associations (Links Clients with Family Members)
CREATE TABLE public.family_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    family_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(client_id, family_profile_id)
);

-- Medical Information
CREATE TABLE public.medical_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE UNIQUE NOT NULL,
    blood_type TEXT,
    allergies TEXT,
    medical_conditions TEXT,
    emergency_instructions TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cases
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    assigned_member_id UUID REFERENCES public.union_members(id) ON DELETE SET NULL,
    status public.case_status NOT NULL DEFAULT 'pending_assignment',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Companion Appointments (Patient Escort logs)
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    hospital_name TEXT NOT NULL,
    department TEXT NOT NULL,
    symptoms TEXT,
    companion_report TEXT,
    family_comm_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Confinement Logs (Maternity log)
CREATE TABLE public.confinement_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    mother_recovery_notes TEXT,
    baby_weight NUMERIC(5,2),
    feeding_time TIMESTAMP WITH TIME ZONE,
    formula_ml INT,
    breastfeeding_mins INT,
    diaper_change TEXT,
    sleep_hours NUMERIC(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Elderly Vitals (Elderly Vitals tracking & pill reminder logs)
CREATE TABLE public.elderly_vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    systolic_bp INT,
    diastolic_bp INT,
    blood_sugar NUMERIC(4,2),
    pulse_bpm INT,
    medication_taken BOOLEAN NOT NULL DEFAULT false,
    medication_notes TEXT,
    family_update_log TEXT,
    general_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shift Care Notes / Reports (General document/image uploads)
CREATE TABLE public.care_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    logged_by UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    visit_summary TEXT,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Billing / Revenue
CREATE TABLE public.billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.union_members(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_type TEXT NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL
);

-- =========================================================================
-- 3. ENABLING ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.union_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confinement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elderly_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 4. BASIC SECURITY POLICIES (Supabase Role Filters)
-- =========================================================================

-- Admin full access rule helper function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('super_admin', 'union_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Allow public read on active profiles" ON public.profiles
    FOR SELECT USING (status = 'active');

CREATE POLICY "Allow users to read/update their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins full rights on profiles" ON public.profiles
    FOR ALL USING (public.is_admin(auth.uid()));

-- Union Members Policies
CREATE POLICY "Allow members to view/edit self" ON public.union_members
    FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Public can view vetted members digital card info" ON public.union_members
    FOR SELECT USING (true);

CREATE POLICY "Admins full rights on union members" ON public.union_members
    FOR ALL USING (public.is_admin(auth.uid()));

-- Clients Policies
CREATE POLICY "Admins full rights on clients" ON public.clients
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients can view self" ON public.clients
    FOR SELECT USING (auth.uid() = profile_id);

-- =========================================================================
-- 5. DATABASE TRIGGERS
-- =========================================================================

-- Trigger to auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role, status)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'New Union User'),
        coalesce(new.raw_user_meta_data->>'phone', '-'),
        coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer'),
        'pending_verification'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to generate MCSA-YYYY-XXXX member number
CREATE SEQUENCE IF NOT EXISTS public.member_number_seq;

CREATE OR REPLACE FUNCTION public.generate_member_number()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT;
    seq_val INT;
BEGIN
    IF new.member_number IS NULL THEN
        year_str := to_char(CURRENT_DATE, 'YYYY');
        seq_val := nextval('public.member_number_seq');
        new.member_number := 'MCSA-' || year_str || '-' || lpad(seq_val::text, 4, '0');
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER before_union_member_inserted
    BEFORE INSERT ON public.union_members
    FOR EACH ROW EXECUTE FUNCTION public.generate_member_number();
