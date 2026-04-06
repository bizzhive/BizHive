import { LegalPage } from "@/components/site/LegalPage";

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    description="This policy explains how BizHive collects, stores, uses, and protects personal information when someone uses the website, creates an account, or submits information through the platform."
    sections={[
      {
        title: "Information we collect",
        body: "BizHive may collect account data, profile information, saved business context, community submissions, support messages, newsletter sign-ups, and usage information needed to operate the product. We also collect data you choose to submit in documents, tools, and onboarding forms.",
      },
      {
        title: "How we use information",
        body: "We use information to provide access to the platform, save workspace state, improve product flows, respond to support requests, maintain platform security, and communicate service updates. We may also use aggregated usage patterns to improve product design and planning.",
      },
      {
        title: "Third-party services",
        body: "BizHive uses third-party infrastructure and service providers including hosting, analytics, authentication, and database services. These providers may process information on our behalf to operate the product, subject to their own legal terms and security controls.",
      },
      {
        title: "Your choices",
        body: "You may request updates or deletion of account-linked information where legally permitted. Some operational and compliance records may need to be retained for security, fraud prevention, or legal obligations. Community posts and public-facing contributions may remain visible if they form part of shared discussion history.",
      },
    ]}
  />
);

export default Privacy;
