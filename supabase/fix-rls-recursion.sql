    -- Fix infinite recursion in RLS policies
    -- Run this in your Supabase SQL Editor

    -- Step 1: Drop existing problematic policies
    DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
    DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
    DROP POLICY IF EXISTS "Admins can manage engineers" ON public.engineers;
    DROP POLICY IF EXISTS "Admins can manage service requests" ON public.service_requests;
    DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;

    -- Step 2: Drop and recreate the helper function with proper RLS bypass
    DROP FUNCTION IF EXISTS public.is_admin();

    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS BOOLEAN AS $$
    DECLARE
        user_role user_role;
    BEGIN
        -- SECURITY DEFINER functions bypass RLS
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

    -- Step 3: Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

    -- Step 4: Recreate policies using the helper function
    CREATE POLICY "Admins can read all users"
        ON public.users FOR SELECT
        USING (public.is_admin());

    CREATE POLICY "Admins can manage services"
        ON public.services FOR ALL
        USING (public.is_admin());

    CREATE POLICY "Admins can manage engineers"
        ON public.engineers FOR ALL
        USING (public.is_admin());

    CREATE POLICY "Admins can manage service requests"
        ON public.service_requests FOR ALL
        USING (public.is_admin());

    CREATE POLICY "Admins can manage reviews"
        ON public.reviews FOR ALL
        USING (public.is_admin());

