import { LegalPage } from "@/components/site/LegalPage";

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    description="These terms govern access to BizHive and explain the responsibilities, limitations, and expected use of the product."
    sections={[
      {
        title: "Use of the platform",
        body: "BizHive provides planning tools, document resources, educational content, workspace features, and community functionality. The service is intended to support founder decision-making, but it does not automatically replace legal, tax, accounting, or licensed professional advice.",
      },
      {
        title: "Accounts and security",
        body: "You are responsible for maintaining the security of your account, devices, and credentials. You must not misuse the platform, attempt unauthorized access, or interfere with the experience of other users.",
      },
      {
        title: "Content and templates",
        body: "Public content, templates, and guidance are provided for informational use. You are responsible for reviewing whether they are suitable for your business, jurisdiction, and transaction. BizHive may update or remove content as the product evolves.",
      },
      {
        title: "Liability and changes",
        body: "BizHive is provided on an evolving basis. To the extent allowed by law, we are not liable for indirect or consequential loss arising from use of the platform. We may revise the service, these terms, and individual features over time, with continued use constituting acceptance of the updated terms where legally valid.",
      },
    ]}
  />
);

export default Terms;
