-- Fix missing INSERT policy for users table
-- This allows authenticated users to create their own profile

-- Add INSERT policy for users to create their own profile
CREATE POLICY "Users can create own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- If you already have this policy, you'll get an error - that's OK, just skip it

