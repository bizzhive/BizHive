export type PublicLegalPage = {
  id: string;
  summary: string;
  title: string;
};

export type LegalTemplateSeed = {
  category: string;
  fieldSchema: Array<{ label: string; name: string; placeholder?: string; type?: string }>;
  slug: string;
  summary: string;
  templateContent: string;
  title: string;
};

export const publicLegalPages: PublicLegalPage[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    summary: "How BizHive collects, stores, and uses personal information.",
  },
  {
    id: "terms",
    title: "Terms of Service",
    summary: "The operating terms for using the BizHive product and content.",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    summary: "How cookies, analytics, and preference storage work on BizHive.",
  },
  {
    id: "refund",
    title: "Refund Policy",
    summary: "Refund and cancellation expectations for paid product access.",
  },
  {
    id: "disclaimer",
    title: "Legal Disclaimer",
    summary: "Important limitations around guidance, templates, and educational content.",
  },
];

export const legalTemplateFallbacks: LegalTemplateSeed[] = [
  {
    slug: "mutual-nda",
    title: "Mutual Non-Disclosure Agreement",
    category: "contracts",
    summary: "A starter NDA for two parties sharing confidential business information.",
    fieldSchema: [
      { name: "effective_date", label: "Effective date", placeholder: "6 April 2026" },
      { name: "party_one", label: "Party one legal name", placeholder: "BizHive Private Limited" },
      { name: "party_two", label: "Party two legal name", placeholder: "Client or partner name" },
      { name: "purpose", label: "Purpose of disclosure", placeholder: "Evaluating a strategic partnership" },
      { name: "term", label: "Confidentiality term", placeholder: "3 years" },
    ],
    templateContent: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement is entered into on {{effective_date}} between {{party_one}} and {{party_two}} for the purpose of {{purpose}}.

1. Confidential Information
Each party may disclose business, technical, financial, customer, operational, or strategic information that is not public and is reasonably understood to be confidential.

2. Use Restriction
Each party agrees to use the confidential information only for the stated purpose and not for any competing, unrelated, or unauthorized activity.

3. Protection Standard
Each party will protect the other party's confidential information with reasonable care and will limit access to personnel or advisors who need it for the stated purpose.

4. Exclusions
Confidential information does not include information that becomes public without breach, was already known lawfully, is independently developed, or is lawfully received from another source without confidentiality obligations.

5. Return or Destruction
Upon request, each party will return or destroy confidential materials, subject to lawful archival retention requirements.

6. Term
The confidentiality obligations under this Agreement will continue for {{term}} from the effective date unless a longer legal obligation applies.

7. Governing Law
This Agreement should be reviewed and adapted for the governing law and dispute process relevant to the parties before execution.

Signed:
{{party_one}}

{{party_two}}`,
  },
  {
    slug: "service-agreement",
    title: "Service Agreement",
    category: "contracts",
    summary: "A practical service agreement template for agencies, consultants, and freelancers.",
    fieldSchema: [
      { name: "provider_name", label: "Service provider name", placeholder: "Provider legal name" },
      { name: "client_name", label: "Client name", placeholder: "Client legal name" },
      { name: "services_scope", label: "Scope of services", placeholder: "Describe the services to be delivered" },
      { name: "start_date", label: "Start date", placeholder: "6 April 2026" },
      { name: "fees", label: "Fees and payment terms", placeholder: "₹75,000 payable within 15 days of invoice" },
    ],
    templateContent: `SERVICE AGREEMENT

This Service Agreement is made between {{provider_name}} and {{client_name}} effective {{start_date}}.

1. Services
The provider will deliver the following services: {{services_scope}}.

2. Fees
The client agrees to pay the provider as follows: {{fees}}.

3. Timelines and Dependencies
Delivery timelines depend on timely access, approvals, data, and other dependencies reasonably required from the client.

4. Intellectual Property
Ownership, usage rights, source files, and licensing terms should be defined clearly before work begins and before final delivery.

5. Confidentiality
Both parties agree to keep confidential business information private except where disclosure is legally required or operationally necessary under controlled conditions.

6. Termination
Either party may terminate this Agreement according to the notice and payment terms agreed between the parties. Any completed work up to the termination date remains payable unless otherwise agreed.

7. Governing Law
This template should be reviewed and adapted for the governing law and dispute mechanism relevant to the transaction.

Accepted by:
{{provider_name}}

{{client_name}}`,
  },
  {
    slug: "offer-letter",
    title: "Employment Offer Letter",
    category: "hr",
    summary: "A founder-friendly offer letter starter for an employee or early team member.",
    fieldSchema: [
      { name: "candidate_name", label: "Candidate name", placeholder: "Full legal name" },
      { name: "role_title", label: "Role title", placeholder: "Product Designer" },
      { name: "joining_date", label: "Joining date", placeholder: "15 April 2026" },
      { name: "compensation", label: "Compensation", placeholder: "₹8,40,000 per annum" },
      { name: "work_location", label: "Work location", placeholder: "Bengaluru / Hybrid" },
    ],
    templateContent: `EMPLOYMENT OFFER LETTER

Dear {{candidate_name}},

We are pleased to offer you the position of {{role_title}} with an expected joining date of {{joining_date}}.

1. Compensation
Your compensation package will be {{compensation}}, subject to applicable taxes, deductions, and company policies.

2. Work Location
Your primary work location will be {{work_location}}, subject to the operating needs of the business.

3. Conditions
This offer is subject to identity verification, reference checks, and any documentation required by law or company policy.

4. Policies
Your employment will be governed by company policies, confidentiality obligations, acceptable-use expectations, and other employment documentation issued at onboarding.

5. At-Will / Applicable Employment Terms
This letter should be reviewed and adapted to comply with local employment law and the exact nature of the engagement before use.

We look forward to building with you.

For the Company

Accepted by {{candidate_name}}`,
  },
];
