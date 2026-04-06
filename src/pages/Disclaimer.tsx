import { LegalPage } from "@/components/site/LegalPage";

const Disclaimer = () => (
  <LegalPage
    title="Legal Disclaimer"
    description="This disclaimer clarifies the limits of BizHive's educational content, templates, calculators, compliance guidance, learning modules, and other platform materials."
    sections={[
      {
        title: "Educational and operational support only",
        body: "BizHive provides educational content, operational structure, starter templates, planning tools, and workflow guidance intended to help founders work more clearly. Except where explicitly provided through a separate and qualified professional engagement, BizHive does not provide regulated legal representation, tax representation, chartered accountancy advice, company-secretarial advice, or licensed financial advisory services.",
      },
      {
        title: "No guarantee of legal or commercial suitability",
        body: "Templates, policy pages, compliance guidance, calculators, and explanatory content are prepared as practical working materials and may not reflect every factual, contractual, regulatory, or jurisdiction-specific requirement relevant to a user's business. Users must independently assess whether any output, clause, filing step, or recommendation is appropriate before relying on it in a real-world transaction or compliance context.",
      },
      {
        title: "Independent verification is required",
        body: "Where the stakes are material, users should obtain independent legal, tax, accounting, regulatory, financial, or commercial advice from suitably qualified professionals before executing agreements, making filings, onboarding employees, entering commercial commitments, or relying on platform-generated planning outputs. BizHive does not assume responsibility for business decisions made without such review.",
      },
      {
        title: "Sources and evolving information",
        body: "BizHive may reference official portals, public resources, and publicly available explanatory material to improve clarity. Laws, portal workflows, forms, fee structures, filing rules, platform policies, and regulatory interpretations may change over time. Users are responsible for checking current official sources and verifying that any referenced process remains accurate at the time of use.",
      },
    ]}
  />
);

export default Disclaimer;
