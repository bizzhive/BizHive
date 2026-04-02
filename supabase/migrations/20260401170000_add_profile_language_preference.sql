ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en';

UPDATE public.profiles
SET preferred_language = 'en'
WHERE preferred_language IS NULL OR btrim(preferred_language) = '';
