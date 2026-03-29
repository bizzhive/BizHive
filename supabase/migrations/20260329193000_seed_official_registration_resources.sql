-- Seed official-source startup registrations and editable preparation worksheets.

INSERT INTO public.documents (title, category, description, is_premium, file_url, tags)
SELECT
  'Udyam Registration Official Portal',
  'business',
  'Official MSME / Udyam registration portal from the Ministry of MSME. Use the linked preparation worksheet to gather details before filing.',
  false,
  'https://udyamregistration.gov.in/UdyamReg.aspx',
  ARRAY['official-source', 'msme', 'udyam', 'template:udyam-registration-prep-sheet']
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents WHERE title = 'Udyam Registration Official Portal'
);

INSERT INTO public.documents (title, category, description, is_premium, file_url, tags)
SELECT
  'GST Registration Help Centre',
  'financial',
  'Official GST help and registration guidance. Use the linked preparation worksheet to collect the business, promoter, and bank details you will need.',
  false,
  'https://www.gst.gov.in/help/registration',
  ARRAY['official-source', 'gst', 'registration', 'template:gst-registration-prep-sheet']
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents WHERE title = 'GST Registration Help Centre'
);

INSERT INTO public.documents (title, category, description, is_premium, file_url, tags)
SELECT
  'FSSAI FoSCoS Registration Portal',
  'legal',
  'Official FoSCoS portal for food business registration and licensing. Use the linked worksheet to prepare address, category, and business details before applying.',
  false,
  'https://foscos.fssai.gov.in/',
  ARRAY['official-source', 'fssai', 'food', 'template:fssai-registration-prep-sheet']
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents WHERE title = 'FSSAI FoSCoS Registration Portal'
);

INSERT INTO public.documents (title, category, description, is_premium, file_url, tags)
SELECT
  'Import Export Code (IEC) Portal',
  'business',
  'Official DGFT portal for IEC applications and profile management. Use the linked worksheet to collect exporter details before you start the online filing.',
  false,
  'https://www.dgft.gov.in/CP/',
  ARRAY['official-source', 'iec', 'dgft', 'template:iec-prep-sheet']
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents WHERE title = 'Import Export Code (IEC) Portal'
);

INSERT INTO public.documents (title, category, description, is_premium, file_url, tags)
SELECT
  'SPICe+ Incorporation Guide (MCA)',
  'business',
  'Official Ministry of Corporate Affairs guidance for SPICe+ company incorporation. Use the linked worksheet to gather promoter, registered office, and capital details.',
  false,
  'https://www.mca.gov.in/content/dam/mca/videos/audio_pdfs/Video_SPICeplus_AudioText.pdf',
  ARRAY['official-source', 'mca', 'incorporation', 'template:spice-plus-incorporation-prep-sheet']
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents WHERE title = 'SPICe+ Incorporation Guide (MCA)'
);

INSERT INTO public.legal_document_templates (title, slug, category, summary, template_content, field_schema)
VALUES
  (
    'Udyam Registration Prep Sheet',
    'udyam-registration-prep-sheet',
    'registration',
    'Editable preparation worksheet for the official Udyam registration portal. Verify final requirements on the live government portal before filing.',
    'UDYAM REGISTRATION PREPARATION SHEET\n\nBusiness Name: {{business_name}}\nOrganisation Type: {{organisation_type}}\nAadhaar Holder / Authorised Signatory: {{aadhaar_holder_name}}\nPAN: {{pan_number}}\nGSTIN (if applicable): {{gstin}}\nMobile Number: {{mobile_number}}\nEmail Address: {{email_address}}\nBusiness Address: {{business_address}}\nDate of Commencement: {{commencement_date}}\nPrimary Activity: {{primary_activity}}\nNIC Code / Description: {{nic_description}}\nBank Account Number: {{bank_account_number}}\nIFSC Code: {{ifsc_code}}\nEmployee Count: {{employee_count}}\nInvestment in Plant and Machinery / Equipment: {{investment_value}}\nAnnual Turnover: {{annual_turnover}}\nNotes: {{notes}}\n\nReminder: Udyam registration is filed online on the official MSME portal and does not require upload of supporting documents at the initial step as per the portal guidance referenced on March 29, 2026.',
    '[{"name":"business_name","label":"Business Name","type":"text","placeholder":"BizHive Foods"},{"name":"organisation_type","label":"Organisation Type","type":"text","placeholder":"Proprietorship / Partnership / Company / LLP"},{"name":"aadhaar_holder_name","label":"Aadhaar Holder / Authorised Signatory","type":"text","placeholder":"Tushar Gehlot"},{"name":"pan_number","label":"PAN","type":"text","placeholder":"ABCDE1234F"},{"name":"gstin","label":"GSTIN (if applicable)","type":"text","placeholder":"27ABCDE1234F1Z5"},{"name":"mobile_number","label":"Mobile Number","type":"text","placeholder":"+91 98XXXXXX98"},{"name":"email_address","label":"Email Address","type":"text","placeholder":"founder@bizhive.in"},{"name":"business_address","label":"Business Address","type":"textarea","placeholder":"Registered office / principal place of business"},{"name":"commencement_date","label":"Date of Commencement","type":"date","placeholder":"2026-03-29"},{"name":"primary_activity","label":"Primary Activity","type":"text","placeholder":"Manufacturing / Services / Trading"},{"name":"nic_description","label":"NIC Code / Activity Description","type":"textarea","placeholder":"Describe the main activity you will register"},{"name":"bank_account_number","label":"Bank Account Number","type":"text","placeholder":"XXXXXXXXXXXX1234"},{"name":"ifsc_code","label":"IFSC Code","type":"text","placeholder":"HDFC0001234"},{"name":"employee_count","label":"Employee Count","type":"text","placeholder":"4"},{"name":"investment_value","label":"Investment Value","type":"text","placeholder":"INR 6,00,000"},{"name":"annual_turnover","label":"Annual Turnover","type":"text","placeholder":"INR 18,00,000"},{"name":"notes","label":"Notes","type":"textarea","placeholder":"Anything you want to double-check before filing"}]'::jsonb
  ),
  (
    'GST Registration Prep Sheet',
    'gst-registration-prep-sheet',
    'registration',
    'Editable preparation worksheet for gathering the details commonly required before applying for GST registration on the official portal.',
    'GST REGISTRATION PREPARATION SHEET\n\nLegal Name of Business: {{legal_name}}\nTrade Name: {{trade_name}}\nPAN of Business / Proprietor: {{pan_number}}\nConstitution of Business: {{business_constitution}}\nDate of Commencement of Business: {{commencement_date}}\nReason for Registration: {{reason_for_registration}}\nPrincipal Place of Business: {{principal_place_of_business}}\nAdditional Places of Business: {{additional_places}}\nPromoter / Partner / Director Details: {{stakeholder_details}}\nAuthorised Signatory: {{authorised_signatory}}\nBank Account Details: {{bank_details}}\nBusiness Activity: {{business_activity}}\nGoods / Services Description: {{goods_services_description}}\nState / Jurisdiction: {{state_jurisdiction}}\nSupporting Documents Checklist: {{supporting_documents}}\nNotes: {{notes}}\n\nReminder: The exact online form flow and supporting documents may vary by business type and Aadhaar authentication path. Confirm the current REG-01 workflow on the official GST portal before submission.',
    '[{"name":"legal_name","label":"Legal Name of Business","type":"text","placeholder":"BizHive Technologies Private Limited"},{"name":"trade_name","label":"Trade Name","type":"text","placeholder":"BizHive"},{"name":"pan_number","label":"PAN","type":"text","placeholder":"ABCDE1234F"},{"name":"business_constitution","label":"Constitution of Business","type":"text","placeholder":"Private Limited Company / Proprietorship / LLP"},{"name":"commencement_date","label":"Date of Commencement of Business","type":"date","placeholder":"2026-03-29"},{"name":"reason_for_registration","label":"Reason for Registration","type":"text","placeholder":"Crossed threshold / Voluntary / Inter-state supply"},{"name":"principal_place_of_business","label":"Principal Place of Business","type":"textarea","placeholder":"Full address with PIN code"},{"name":"additional_places","label":"Additional Places of Business","type":"textarea","placeholder":"List other business locations, if any"},{"name":"stakeholder_details","label":"Promoter / Partner / Director Details","type":"textarea","placeholder":"Name, PAN, Aadhaar, address, designation"},{"name":"authorised_signatory","label":"Authorised Signatory","type":"textarea","placeholder":"Name, designation, contact details"},{"name":"bank_details","label":"Bank Account Details","type":"textarea","placeholder":"Account number, IFSC, supporting proof available"},{"name":"business_activity","label":"Business Activity","type":"text","placeholder":"Wholesale / Retail / Services / Manufacturing / Works Contract"},{"name":"goods_services_description","label":"Goods / Services Description","type":"textarea","placeholder":"Short summary of the goods or services you will supply"},{"name":"state_jurisdiction","label":"State / Jurisdiction","type":"text","placeholder":"Rajasthan / Jaipur"},{"name":"supporting_documents","label":"Supporting Documents Checklist","type":"textarea","placeholder":"PAN, proof of constitution, address proof, bank proof, photos, authorisation letter"},{"name":"notes","label":"Notes","type":"textarea","placeholder":"Anything to verify before opening the portal"}]'::jsonb
  ),
  (
    'FSSAI Registration Prep Sheet',
    'fssai-registration-prep-sheet',
    'registration',
    'Editable preparation worksheet for basic FSSAI registration or licence planning before you begin filing on FoSCoS.',
    'FSSAI REGISTRATION PREPARATION SHEET\n\nFood Business Name: {{business_name}}\nApplicant Name: {{applicant_name}}\nBusiness Constitution: {{business_constitution}}\nFood Category / Activity: {{food_activity}}\nRegistered Address: {{registered_address}}\nOperational Address: {{operational_address}}\nContact Details: {{contact_details}}\nIdentity Proof Available: {{identity_proof}}\nAddress Proof Available: {{address_proof}}\nExpected Annual Turnover: {{turnover}}\nProduction / Handling Capacity: {{capacity}}\nBusiness Start Date: {{start_date}}\nFood Safety Contact Person: {{food_safety_contact}}\nNotes: {{notes}}\n\nReminder: Licence type and supporting documents depend on your food category, turnover, and operating model. Verify the latest FoSCoS requirements before filing.',
    '[{"name":"business_name","label":"Food Business Name","type":"text","placeholder":"BizHive Foods"},{"name":"applicant_name","label":"Applicant Name","type":"text","placeholder":"Tushar Gehlot"},{"name":"business_constitution","label":"Business Constitution","type":"text","placeholder":"Proprietorship / Partnership / Company / LLP"},{"name":"food_activity","label":"Food Category / Activity","type":"textarea","placeholder":"Cloud kitchen / Retail / Manufacturing / Storage / Distribution"},{"name":"registered_address","label":"Registered Address","type":"textarea","placeholder":"Registered office address"},{"name":"operational_address","label":"Operational Address","type":"textarea","placeholder":"Kitchen / outlet / warehouse address"},{"name":"contact_details","label":"Contact Details","type":"textarea","placeholder":"Mobile and email used for the application"},{"name":"identity_proof","label":"Identity Proof Available","type":"text","placeholder":"Aadhaar / PAN / Passport / Voter ID"},{"name":"address_proof","label":"Address Proof Available","type":"text","placeholder":"Electricity bill / Rent agreement / Property tax receipt"},{"name":"turnover","label":"Expected Annual Turnover","type":"text","placeholder":"INR 8,00,000"},{"name":"capacity","label":"Production / Handling Capacity","type":"text","placeholder":"250 meals per day"},{"name":"start_date","label":"Business Start Date","type":"date","placeholder":"2026-03-29"},{"name":"food_safety_contact","label":"Food Safety Contact Person","type":"text","placeholder":"Operations Manager / Founder"},{"name":"notes","label":"Notes","type":"textarea","placeholder":"Any licensing questions to verify before filing"}]'::jsonb
  ),
  (
    'IEC Application Prep Sheet',
    'iec-prep-sheet',
    'registration',
    'Editable preparation worksheet for gathering the exporter details you will need before starting the official DGFT IEC application.',
    'IMPORT EXPORT CODE (IEC) PREPARATION SHEET\n\nApplicant / Entity Name: {{entity_name}}\nPAN: {{pan_number}}\nBusiness Constitution: {{business_constitution}}\nRegistered Office Address: {{registered_address}}\nBranch / Factory Address: {{branch_address}}\nBank Account Details: {{bank_details}}\nPreferred Contact Email: {{email_address}}\nMobile Number: {{mobile_number}}\nDirectors / Partners / Proprietor Details: {{stakeholder_details}}\nImport / Export Product Categories: {{product_categories}}\nDigital Signature / Aadhaar Readiness: {{digital_readiness}}\nNotes: {{notes}}\n\nReminder: IEC filings and profile updates are handled on the official DGFT portal. Review the latest portal workflow and identity requirements before submission.',
    '[{"name":"entity_name","label":"Applicant / Entity Name","type":"text","placeholder":"BizHive Exports LLP"},{"name":"pan_number","label":"PAN","type":"text","placeholder":"ABCDE1234F"},{"name":"business_constitution","label":"Business Constitution","type":"text","placeholder":"Proprietorship / Partnership / LLP / Company"},{"name":"registered_address","label":"Registered Office Address","type":"textarea","placeholder":"Registered office address"},{"name":"branch_address","label":"Branch / Factory Address","type":"textarea","placeholder":"Branch, warehouse, or factory address if applicable"},{"name":"bank_details","label":"Bank Account Details","type":"textarea","placeholder":"Account number, IFSC, cancelled cheque or statement readiness"},{"name":"email_address","label":"Preferred Contact Email","type":"text","placeholder":"exports@bizhive.in"},{"name":"mobile_number","label":"Mobile Number","type":"text","placeholder":"+91 98XXXXXX98"},{"name":"stakeholder_details","label":"Directors / Partners / Proprietor Details","type":"textarea","placeholder":"Name, designation, address, identity details"},{"name":"product_categories","label":"Import / Export Product Categories","type":"textarea","placeholder":"List major product or service categories you will trade"},{"name":"digital_readiness","label":"Digital Signature / Aadhaar Readiness","type":"textarea","placeholder":"Mention whether Aadhaar e-sign or DSC is ready"},{"name":"notes","label":"Notes","type":"textarea","placeholder":"Any DGFT-specific questions to confirm before applying"}]'::jsonb
  ),
  (
    'SPICe+ Incorporation Prep Sheet',
    'spice-plus-incorporation-prep-sheet',
    'registration',
    'Editable preparation worksheet for gathering the promoter, capital, and registered-office details commonly needed before starting SPICe+ incorporation on the MCA portal.',
    'SPICe+ INCORPORATION PREPARATION SHEET\n\nProposed Company Name Options: {{name_options}}\nEntity Type: {{entity_type}}\nMain Objects / Business Purpose: {{main_objects}}\nAuthorised Capital: {{authorised_capital}}\nPaid-up Capital: {{paid_up_capital}}\nRegistered Office Address: {{registered_office}}\nSubscriber / Director Details: {{subscriber_details}}\nDIN / DSC Status: {{din_dsc_status}}\nShareholding Split: {{shareholding_split}}\nProfessional Support (CA / CS / CMA): {{professional_support}}\nRequired Linked Registrations: {{linked_registrations}}\nNotes: {{notes}}\n\nReminder: SPICe+ is a live MCA filing flow with linked services. Confirm the latest MCA guidance, naming rules, and professional certification requirements before filing.',
    '[{"name":"name_options","label":"Proposed Company Name Options","type":"textarea","placeholder":"Option 1, Option 2, Option 3"},{"name":"entity_type","label":"Entity Type","type":"text","placeholder":"Private Limited Company / OPC / Section 8 Company"},{"name":"main_objects","label":"Main Objects / Business Purpose","type":"textarea","placeholder":"Describe the principal business activity for name approval and MOA drafting"},{"name":"authorised_capital","label":"Authorised Capital","type":"text","placeholder":"INR 10,00,000"},{"name":"paid_up_capital","label":"Paid-up Capital","type":"text","placeholder":"INR 1,00,000"},{"name":"registered_office","label":"Registered Office Address","type":"textarea","placeholder":"Full address with utility proof availability"},{"name":"subscriber_details","label":"Subscriber / Director Details","type":"textarea","placeholder":"Name, DIN, PAN, Aadhaar, address, occupation, nationality"},{"name":"din_dsc_status","label":"DIN / DSC Status","type":"textarea","placeholder":"Mention which proposed directors already have DIN / DSC"},{"name":"shareholding_split","label":"Shareholding Split","type":"textarea","placeholder":"List subscribers and number of shares"},{"name":"professional_support","label":"Professional Support (CA / CS / CMA)","type":"text","placeholder":"Name of certifying professional if engaged"},{"name":"linked_registrations","label":"Required Linked Registrations","type":"textarea","placeholder":"EPFO, ESIC, bank account, PAN, TAN, GST (if needed)"},{"name":"notes","label":"Notes","type":"textarea","placeholder":"Anything to verify before opening SPICe+"}]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;
