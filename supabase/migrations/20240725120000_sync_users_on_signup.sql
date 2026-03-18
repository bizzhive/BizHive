
-- This function is triggered when a new user signs up via Supabase Auth.
-- 1. It creates a corresponding record in the `public.users` table. This is crucial for foreign key relationships, like in the `user_roles` table.
-- 2. It creates a basic profile for the user in the `public.profiles` table, pulling their name from the sign-up metadata. This ensures the user dashboard loads correctly without errors.
-- This setup ensures that new user sign-ups are reflected in "real-time" across the application's database.

CREATE OR REPLACE FUNCTION public.handle_new_user_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a record in public.users
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Create a profile record in public.profiles
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger fires after a new user is inserted into the auth.users table
-- and executes the function to sync the user data to public tables.
CREATE TRIGGER on_auth_user_created_sync
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_sync();
