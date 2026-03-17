CREATE TABLE public.profiles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  PRIMARY KEY (user_id)
);