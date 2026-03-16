
-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view subscribers
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed documents table with initial data
INSERT INTO public.documents (title, category, description, is_premium, tags) VALUES
('GST Registration Application', 'financial', 'Complete form for Goods and Services Tax registration with step-by-step guide', false, ARRAY['gst', 'tax', 'registration']),
('Private Limited Company Incorporation Kit', 'business', 'Complete set of documents for company incorporation including MOA, AOA, and forms', true, ARRAY['incorporation', 'pvt-ltd', 'company']),
('Employment Contract Template', 'hr', 'Comprehensive employment agreement template compliant with Indian labor laws', true, ARRAY['employment', 'contract', 'hr']),
('FSSAI License Application', 'legal', 'Food Safety and Standards Authority license application with required documents checklist', false, ARRAY['fssai', 'food', 'license']),
('Non-Disclosure Agreement (NDA)', 'contracts', 'Mutual and unilateral NDA templates for protecting confidential business information', true, ARRAY['nda', 'confidential', 'agreement']),
('Trademark Registration Guide', 'legal', 'Complete guide and forms for trademark registration in India with examples', false, ARRAY['trademark', 'ip', 'registration']),
('Partnership Deed Template', 'legal', 'Standard partnership deed template with customizable clauses', false, ARRAY['partnership', 'deed', 'agreement']),
('Business Loan Application Kit', 'financial', 'Templates and guides for applying to MUDRA and other business loans', true, ARRAY['loan', 'mudra', 'finance']),
('Shop and Establishment Registration', 'legal', 'State-wise registration forms and compliance guide', false, ARRAY['shop', 'establishment', 'license']),
('Salary Slip Template', 'hr', 'Professional salary slip template with all statutory deductions', false, ARRAY['salary', 'payroll', 'hr']),
('Board Resolution Templates', 'business', 'Common board resolution formats for private limited companies', true, ARRAY['board', 'resolution', 'company']),
('Vendor Agreement Template', 'contracts', 'Standard vendor/supplier agreement with payment and delivery terms', true, ARRAY['vendor', 'supplier', 'agreement']);

-- Add launch_checklist table for persisting checklist state
CREATE TABLE public.launch_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checklist_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.launch_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checklist"
ON public.launch_checklist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist"
ON public.launch_checklist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist"
ON public.launch_checklist FOR UPDATE USING (auth.uid() = user_id);
