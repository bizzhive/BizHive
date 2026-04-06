import { LegalPage } from "@/components/site/LegalPage";

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    description="These Terms of Service govern access to and use of BizHive, including public content, user workspaces, community features, educational modules, documents, templates, and future premium offerings."
    sections={[
      {
        title: "Acceptance and platform nature",
        body: "By accessing or using BizHive, you agree to these Terms to the extent legally enforceable. BizHive is a founder operating workspace that combines planning tools, educational material, templates, community interaction, and product utilities. Unless expressly stated otherwise in a separate signed engagement, the platform is not a law firm, chartered accountancy practice, regulated advisory institution, or fiduciary representative.",
      },
      {
        title: "Account responsibilities and acceptable use",
        body: "You are responsible for maintaining the confidentiality of account credentials, safeguarding devices used to access the platform, and ensuring that activity under your account complies with law and these Terms. You must not misuse the service, attempt unauthorized access, interfere with the experience of other users, upload malicious content, impersonate another person, or use BizHive for unlawful, fraudulent, or abusive purposes.",
      },
      {
        title: "Content, templates, and operational materials",
        body: "BizHive may provide public or account-linked templates, legal starter documents, compliance checklists, calculators, articles, and structured learning content. These materials are intended to support working preparation and decision clarity. You remain solely responsible for determining whether any template, clause, checklist, filing step, commercial assumption, or recommendation is appropriate for your specific business, transaction, jurisdiction, or regulatory context.",
      },
      {
        title: "Community conduct and user submissions",
        body: "Where community or public feedback features are available, you retain responsibility for the accuracy, legality, and appropriateness of your submissions. BizHive may moderate, limit, remove, or retain such content where necessary to preserve platform quality, comply with legal obligations, respond to complaints, protect users, or enforce these Terms. Submission of public-facing content does not obligate BizHive to publish, preserve, or promote it indefinitely.",
      },
      {
        title: "Availability, limitations, and liability",
        body: "BizHive may update, suspend, remove, or modify features at any time as the product evolves. To the maximum extent permitted by law, BizHive disclaims liability for indirect, incidental, consequential, or special loss arising from use of the platform, reliance on templates or educational materials, temporary unavailability, third-party service failures, or user-side implementation decisions. Nothing in these Terms excludes liability where exclusion is prohibited by applicable law.",
      },
    ]}
  />
);

export default Terms;
