-- Community groups and editable legal documents
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read public community groups" ON public.community_groups;
CREATE POLICY "Anyone can read public community groups"
ON public.community_groups
FOR SELECT
TO public
USING (
  is_private = false
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'moderator')
);

DROP POLICY IF EXISTS "Admins and moderators can manage community groups" ON public.community_groups;
CREATE POLICY "Admins and moderators can manage community groups"
ON public.community_groups
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

DROP TRIGGER IF EXISTS update_community_groups_updated_at ON public.community_groups;
CREATE TRIGGER update_community_groups_updated_at
BEFORE UPDATE ON public.community_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.community_groups(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_community_posts_group_id ON public.community_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_post_id_created_at ON public.community_messages(post_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.legal_document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  summary TEXT,
  jurisdiction TEXT NOT NULL DEFAULT 'India',
  template_content TEXT NOT NULL,
  field_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_document_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published legal templates" ON public.legal_document_templates;
CREATE POLICY "Anyone can read published legal templates"
ON public.legal_document_templates
FOR SELECT
TO public
USING (published = true);

DROP POLICY IF EXISTS "Admins can manage legal templates" ON public.legal_document_templates;
CREATE POLICY "Admins can manage legal templates"
ON public.legal_document_templates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_legal_document_templates_updated_at ON public.legal_document_templates;
CREATE TRIGGER update_legal_document_templates_updated_at
BEFORE UPDATE ON public.legal_document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.user_legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.legal_document_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT,
  field_values JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_legal_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own legal docs" ON public.user_legal_documents;
CREATE POLICY "Users can view own legal docs"
ON public.user_legal_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own legal docs" ON public.user_legal_documents;
CREATE POLICY "Users can insert own legal docs"
ON public.user_legal_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own legal docs" ON public.user_legal_documents;
CREATE POLICY "Users can update own legal docs"
ON public.user_legal_documents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own legal docs" ON public.user_legal_documents;
CREATE POLICY "Users can delete own legal docs"
ON public.user_legal_documents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user legal docs" ON public.user_legal_documents;
CREATE POLICY "Admins can manage all user legal docs"
ON public.user_legal_documents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_user_legal_documents_updated_at ON public.user_legal_documents;
CREATE TRIGGER update_user_legal_documents_updated_at
BEFORE UPDATE ON public.user_legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.community_groups (name, slug, description)
VALUES
  ('General Founders', 'general-founders', 'Talk with founders about validation, growth, and day-to-day startup questions.'),
  ('Legal & Compliance', 'legal-compliance', 'Discuss registrations, contracts, GST, IP, and compliance workflows.'),
  ('Funding & Pitching', 'funding-pitching', 'Share funding updates, deck feedback, and investor outreach strategies.'),
  ('Marketing & Growth', 'marketing-growth', 'Trade ideas on acquisition, retention, brand, and content marketing.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.legal_document_templates (title, slug, category, summary, template_content, field_schema)
VALUES
  (
    'Founders Agreement',
    'founders-agreement',
    'founder',
    'Define founder roles, equity, vesting, and decision rights before conflicts begin.',
    'FOUNDERS AGREEMENT\n\nThis Founders Agreement is entered into on {{effective_date}} between {{founder_one_name}} and {{founder_two_name}} for the business {{company_name}}.\n\n1. BUSINESS PURPOSE\nThe founders agree to build and operate {{company_name}} focused on {{business_purpose}}.\n\n2. EQUITY SPLIT\n{{founder_one_name}} shall hold {{founder_one_equity}}% and {{founder_two_name}} shall hold {{founder_two_equity}}% of the founding equity, subject to vesting terms described below.\n\n3. ROLES AND RESPONSIBILITIES\n{{founder_one_name}} will lead {{founder_one_role}}.\n{{founder_two_name}} will lead {{founder_two_role}}.\n\n4. VESTING\nFounder equity shall vest over {{vesting_period}} with a cliff of {{cliff_period}}.\n\n5. DECISION MAKING\nMajor decisions require {{decision_rule}}.\n\n6. CONFIDENTIALITY\nAll proprietary information related to {{company_name}} shall remain confidential.\n\n7. EXIT\nIf a founder leaves, unvested equity will be treated as {{exit_rule}}.\n\nSigned,\n{{founder_one_name}}\n{{founder_two_name}}',
    '[{"name":"effective_date","label":"Effective Date","type":"date","placeholder":"2026-03-17"},{"name":"company_name","label":"Company Name","type":"text","placeholder":"BizHive Labs"},{"name":"business_purpose","label":"Business Purpose","type":"textarea","placeholder":"Build software for entrepreneurs"},{"name":"founder_one_name","label":"Founder 1 Name","type":"text","placeholder":"Aarav Sharma"},{"name":"founder_one_equity","label":"Founder 1 Equity %","type":"text","placeholder":"50"},{"name":"founder_one_role","label":"Founder 1 Role","type":"text","placeholder":"Product and strategy"},{"name":"founder_two_name","label":"Founder 2 Name","type":"text","placeholder":"Diya Kapoor"},{"name":"founder_two_equity","label":"Founder 2 Equity %","type":"text","placeholder":"50"},{"name":"founder_two_role","label":"Founder 2 Role","type":"text","placeholder":"Technology and operations"},{"name":"vesting_period","label":"Vesting Period","type":"text","placeholder":"4 years"},{"name":"cliff_period","label":"Cliff Period","type":"text","placeholder":"12 months"},{"name":"decision_rule","label":"Decision Rule","type":"text","placeholder":"unanimous approval for major decisions"},{"name":"exit_rule","label":"Exit Rule","type":"text","placeholder":"repurchased by the company at nominal value"}]'::jsonb
  ),
  (
    'Mutual NDA',
    'mutual-nda',
    'confidentiality',
    'Protect confidential discussions before partnerships, hiring, or vendor conversations.',
    'MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is effective {{effective_date}} between {{party_one}} and {{party_two}}.\n\n1. PURPOSE\nThe parties wish to explore {{relationship_purpose}}.\n\n2. CONFIDENTIAL INFORMATION\nConfidential information includes {{confidential_scope}}.\n\n3. OBLIGATIONS\nEach party shall protect confidential information using reasonable care and not disclose it except to authorized persons.\n\n4. EXCLUSIONS\nInformation that is public, independently developed, or lawfully received from another source is excluded.\n\n5. TERM\nThis agreement remains in force for {{term_period}}, with confidentiality obligations surviving for {{survival_period}}.\n\n6. GOVERNING LAW\nThis agreement shall be governed by the laws of {{governing_law}}.\n\nSigned,\n{{party_one}}\n{{party_two}}',
    '[{"name":"effective_date","label":"Effective Date","type":"date","placeholder":"2026-03-17"},{"name":"party_one","label":"Party One","type":"text","placeholder":"ABC Ventures Pvt Ltd"},{"name":"party_two","label":"Party Two","type":"text","placeholder":"XYZ Studio LLP"},{"name":"relationship_purpose","label":"Purpose","type":"textarea","placeholder":"a potential commercial partnership"},{"name":"confidential_scope","label":"Confidential Information Scope","type":"textarea","placeholder":"product plans, customer data, code, pricing"},{"name":"term_period","label":"Agreement Term","type":"text","placeholder":"2 years"},{"name":"survival_period","label":"Confidentiality Survival","type":"text","placeholder":"3 years"},{"name":"governing_law","label":"Governing Law","type":"text","placeholder":"India"}]'::jsonb
  ),
  (
    'Employment Offer Letter',
    'employment-offer-letter',
    'hr',
    'Draft a professional offer letter with compensation, joining date, and reporting structure.',
    'EMPLOYMENT OFFER LETTER\n\nDate: {{offer_date}}\n\nDear {{candidate_name}},\n\nWe are pleased to offer you the role of {{job_title}} at {{company_name}}. Your joining date will be {{joining_date}} and you will report to {{reporting_manager}}.\n\nYour annual compensation will be {{annual_ctc}} and your primary place of work will be {{work_location}}.\n\nYour key responsibilities will include {{key_responsibilities}}.\n\nPlease confirm acceptance by {{acceptance_deadline}}.\n\nRegards,\n{{issuer_name}}\n{{company_name}}',
    '[{"name":"offer_date","label":"Offer Date","type":"date","placeholder":"2026-03-17"},{"name":"candidate_name","label":"Candidate Name","type":"text","placeholder":"Riya Mehta"},{"name":"job_title","label":"Job Title","type":"text","placeholder":"Marketing Manager"},{"name":"company_name","label":"Company Name","type":"text","placeholder":"BizHive Labs"},{"name":"joining_date","label":"Joining Date","type":"date","placeholder":"2026-04-01"},{"name":"reporting_manager","label":"Reporting Manager","type":"text","placeholder":"Aarav Sharma"},{"name":"annual_ctc","label":"Annual CTC","type":"text","placeholder":"₹8,00,000"},{"name":"work_location","label":"Work Location","type":"text","placeholder":"Jaipur / Remote"},{"name":"key_responsibilities","label":"Key Responsibilities","type":"textarea","placeholder":"Own campaigns, reporting, and growth experiments"},{"name":"acceptance_deadline","label":"Acceptance Deadline","type":"date","placeholder":"2026-03-24"},{"name":"issuer_name","label":"Issuer Name","type":"text","placeholder":"Tushar Gehlot"}]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;