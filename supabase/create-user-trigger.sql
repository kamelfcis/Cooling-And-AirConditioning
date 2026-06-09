-- Create trigger to automatically create user profile when auth user is created
-- This fixes the "0 rows" error when users sign up

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to run on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- If you have existing auth users without public.users records, run this:
-- (Replace the user ID with your actual user ID)
-- INSERT INTO public.users (id, name, role)
-- SELECT id, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)), COALESCE((raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.users)
-- ON CONFLICT (id) DO NOTHING;

