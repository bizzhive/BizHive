
-- This function is triggered when a new user signs up via Supabase Auth.
-- 1. It creates a corresponding record in the `public.users` table. This is crucial for foreign key relationships, like in the `user_roles` table.
-- 2. It creates a basic profile for the user in the `public.profiles` table, pulling their name from the sign-up metadata. This ensures the user dashboard loads correctly without errors.
-- This setup ensures that new user sign-ups are reflected in "real-time" across the application's database.

CREATE OR REPLACE FUNCTION public.handle_new_user_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a record in public.users
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  
  -- Create a profile record in public.profiles
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (user_id) DO UPDATE
  SET full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger fires after a new user is inserted into the auth.users table
-- and executes the function to sync the user data to public tables.
DROP TRIGGER IF EXISTS on_auth_user_created_sync ON auth.users;
CREATE TRIGGER on_auth_user_created_sync
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_sync();

INSERT INTO public.users (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email;

INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  created_at,
  now()
FROM auth.users
ON CONFLICT (user_id) DO UPDATE
SET full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::public.app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;
