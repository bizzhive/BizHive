CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_bans
    WHERE user_id = _user_id
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;

CREATE POLICY "Authenticated users can create posts"
ON public.community_posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = author_id
  AND NOT public.is_user_banned(auth.uid())
);

CREATE POLICY "Users can update own community posts"
ON public.community_posts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_id
  AND NOT public.is_user_banned(auth.uid())
)
WITH CHECK (
  auth.uid() = author_id
  AND NOT public.is_user_banned(auth.uid())
);

CREATE POLICY "Users can delete own posts"
ON public.community_posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.community_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.community_messages;

CREATE POLICY "Authenticated users can send messages"
ON public.community_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND NOT public.is_user_banned(auth.uid())
);

CREATE POLICY "Users can delete own messages"
ON public.community_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete document files" ON storage.objects;

CREATE POLICY "Public can view document files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

CREATE POLICY "Admins can upload document files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update document files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete document files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);