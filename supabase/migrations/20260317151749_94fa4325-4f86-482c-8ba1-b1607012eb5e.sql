-- Tighten previously permissive public insert policies flagged by the linter
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL
  AND char_length(trim(email)) > 3
  AND position('@' in email) > 1
);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (
  char_length(trim(name)) > 1
  AND char_length(trim(email)) > 3
  AND position('@' in email) > 1
  AND char_length(trim(subject)) > 2
  AND char_length(trim(message)) > 5
  AND char_length(trim(category)) > 0
);