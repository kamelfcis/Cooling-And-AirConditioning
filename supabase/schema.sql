-- ===================================================
-- HVAC SERVICE MARKETPLACE - SUPABASE SCHEMA
-- ===================================================

-- Create Enums
CREATE TYPE user_role AS ENUM ('customer', 'engineer', 'admin');
CREATE TYPE service_status AS ENUM ('pending', 'on_the_way', 'in_progress', 'completed');

-- ===================================================
-- TABLE: users
-- ===================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- TABLE: services
-- ===================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- TABLE: engineers
-- ===================================================
CREATE TABLE IF NOT EXISTS public.engineers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    specialization TEXT,
    years_experience INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- TABLE: service_requests
-- ===================================================
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    engineer_id UUID REFERENCES public.engineers(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    ac_count INTEGER NOT NULL CHECK (ac_count > 0),
    preferred_datetime TIMESTAMPTZ NOT NULL,
    status service_status NOT NULL DEFAULT 'pending',
    estimated_price DECIMAL(10, 2) NOT NULL,
    final_price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ===================================================
-- TABLE: reviews
-- ===================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id UUID NOT NULL UNIQUE REFERENCES public.service_requests(id) ON DELETE CASCADE,
    engineer_id UUID NOT NULL REFERENCES public.engineers(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================================================
-- INDEXES
-- ===================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_engineers_user_id ON public.engineers(user_id);
CREATE INDEX IF NOT EXISTS idx_engineers_is_active ON public.engineers(is_active);
CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON public.service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_engineer_id ON public.service_requests(engineer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_reviews_engineer_id ON public.reviews(engineer_id);

-- ===================================================
-- FUNCTIONS & TRIGGERS
-- ===================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if current user is admin (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
BEGIN
    -- Query with RLS bypass using SECURITY DEFINER context
    -- This function runs with creator privileges, bypassing RLS
    SELECT role INTO user_role
    FROM public.users
    WHERE id = auth.uid()
    LIMIT 1;
    
    RETURN COALESCE(user_role = 'admin', false);
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_engineers_updated_at
    BEFORE UPDATE ON public.engineers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION public.handle_service_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_completed_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_service_completion();

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email::text),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===================================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- RLS POLICIES: users
-- ===================================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users can create their own profile
CREATE POLICY "Users can create own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Admins can read all users (uses helper function to avoid recursion)
CREATE POLICY "Admins can read all users"
    ON public.users FOR SELECT
    USING (public.is_admin());

-- ===================================================
-- RLS POLICIES: services
-- ===================================================
-- Everyone can read active services
CREATE POLICY "Anyone can read active services"
    ON public.services FOR SELECT
    USING (is_active = true);

-- Admins can do everything with services
CREATE POLICY "Admins can manage services"
    ON public.services FOR ALL
    USING (public.is_admin());

-- ===================================================
-- RLS POLICIES: engineers
-- ===================================================
-- Engineers can read their own profile
CREATE POLICY "Engineers can read own profile"
    ON public.engineers FOR SELECT
    USING (user_id = auth.uid());

-- Engineers can update their own profile
CREATE POLICY "Engineers can update own profile"
    ON public.engineers FOR UPDATE
    USING (user_id = auth.uid());

-- Everyone can read active engineers
CREATE POLICY "Anyone can read active engineers"
    ON public.engineers FOR SELECT
    USING (is_active = true);

-- Admins can manage engineers
CREATE POLICY "Admins can manage engineers"
    ON public.engineers FOR ALL
    USING (public.is_admin());

-- ===================================================
-- RLS POLICIES: service_requests
-- ===================================================
-- Customers can read their own requests
CREATE POLICY "Customers can read own requests"
    ON public.service_requests FOR SELECT
    USING (customer_id = auth.uid());

-- Customers can create their own requests
CREATE POLICY "Customers can create own requests"
    ON public.service_requests FOR INSERT
    WITH CHECK (customer_id = auth.uid());

-- Customers can update their own pending requests
CREATE POLICY "Customers can update own pending requests"
    ON public.service_requests FOR UPDATE
    USING (customer_id = auth.uid() AND status = 'pending');

-- Engineers can read assigned requests
CREATE POLICY "Engineers can read assigned requests"
    ON public.service_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.engineers
            WHERE id = service_requests.engineer_id AND user_id = auth.uid()
        )
    );

-- Engineers can update assigned requests (status and final_price)
CREATE POLICY "Engineers can update assigned requests"
    ON public.service_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.engineers
            WHERE id = service_requests.engineer_id AND user_id = auth.uid()
        )
    );

-- Admins can do everything with service requests
CREATE POLICY "Admins can manage service requests"
    ON public.service_requests FOR ALL
    USING (public.is_admin());

-- ===================================================
-- RLS POLICIES: reviews
-- ===================================================
-- Everyone can read reviews
CREATE POLICY "Anyone can read reviews"
    ON public.reviews FOR SELECT
    USING (true);

-- Customers can create reviews for their completed requests
CREATE POLICY "Customers can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        customer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.service_requests
            WHERE id = service_request_id
            AND customer_id = auth.uid()
            AND status = 'completed'
        )
    );

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews"
    ON public.reviews FOR ALL
    USING (public.is_admin());

