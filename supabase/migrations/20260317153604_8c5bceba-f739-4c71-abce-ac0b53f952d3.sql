DROP POLICY IF EXISTS "Admins can manage bans" ON public.user_bans;
CREATE POLICY "Admins and moderators can manage bans"
ON public.user_bans
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can manage all messages" ON public.community_messages;
CREATE POLICY "Admins and moderators can manage all messages"
ON public.community_messages
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can manage all community posts" ON public.community_posts;
CREATE POLICY "Admins and moderators can manage all community posts"
ON public.community_posts
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);