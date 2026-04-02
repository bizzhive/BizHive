CREATE TABLE IF NOT EXISTS public.user_learning_workbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  page_slug TEXT NOT NULL,
  chapter_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, page_slug, chapter_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_learning_workbooks_user_page
  ON public.user_learning_workbooks(user_id, page_slug);

DROP TRIGGER IF EXISTS update_user_learning_workbooks_updated_at
  ON public.user_learning_workbooks;

CREATE TRIGGER update_user_learning_workbooks_updated_at
BEFORE UPDATE ON public.user_learning_workbooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_learning_workbooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own learning workbooks" ON public.user_learning_workbooks;
CREATE POLICY "Users can view own learning workbooks"
ON public.user_learning_workbooks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own learning workbooks" ON public.user_learning_workbooks;
CREATE POLICY "Users can insert own learning workbooks"
ON public.user_learning_workbooks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own learning workbooks" ON public.user_learning_workbooks;
CREATE POLICY "Users can update own learning workbooks"
ON public.user_learning_workbooks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
