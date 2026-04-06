import { LegalPage } from "@/components/site/LegalPage";

const Disclaimer = () => (
  <LegalPage
    title="Legal Disclaimer"
    description="This disclaimer clarifies the limits of BizHive's guidance, templates, calculators, and educational content."
    sections={[
      {
        title: "Information, not professional advice",
        body: "BizHive provides educational, operational, and product support content. Unless explicitly stated otherwise through a qualified professional engagement, the platform does not provide law-firm, CA, tax practitioner, or regulated advisory representation.",
      },
      {
        title: "Template suitability",
        body: "Document templates and checklists are starting points. They may require review and customization for your entity structure, commercial arrangement, industry, state, and governing law before they are suitable for execution.",
      },
      {
        title: "User responsibility",
        body: "You are responsible for reviewing decisions, filings, agreements, and public statements before relying on them in your business. Where the stakes are high, independent legal, tax, financial, or regulatory advice should be obtained.",
      },
    ]}
  />
);

export default Disclaimer;
