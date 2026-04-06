import { LegalPage } from "@/components/site/LegalPage";

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    description="This Privacy Policy explains how BizHive collects, uses, stores, shares, and protects information when users visit the website, create an account, save business data, submit community content, or interact with platform features."
    sections={[
      {
        title: "Scope and information covered",
        body: "BizHive may collect identity information, contact details, account credentials managed through authentication providers, founder profile details, business context, saved documents, legal drafts, feedback submissions, support messages, and product-usage information necessary to operate and improve the platform. We may also process content you voluntarily enter into tools, forms, learning workbooks, community posts, and other workspace features.",
      },
      {
        title: "How information is used",
        body: "We use personal and business information to deliver platform access, save workspaces, personalize product state such as language and progress, operate community and publishing features, respond to support requests, maintain security, investigate abuse, and improve product quality. We may use aggregated and de-identified usage insights to improve product design, navigation, and educational coverage.",
      },
      {
        title: "Storage, infrastructure, and service providers",
        body: "BizHive relies on third-party infrastructure and software services to provide hosting, authentication, storage, analytics, delivery, and operational support. Such providers may process information on our behalf strictly to the extent necessary to operate the product. Access is limited by technical controls, contractual obligations where applicable, and our operational need to maintain the service.",
      },
      {
        title: "Sharing, disclosure, and public content",
        body: "BizHive does not sell personal information as part of its normal product operation. Information may be disclosed where reasonably necessary to comply with law, enforce platform rights, investigate fraud or abuse, protect users, or complete a platform function you requested. Community posts, published feedback, and other deliberately public contributions may remain visible to other users or visitors according to the feature in which they were submitted.",
      },
      {
        title: "User rights, retention, and contact",
        body: "Users may request access, correction, or deletion of account-linked information where legally available and technically reasonable. Certain records may be retained for platform integrity, legal compliance, fraud prevention, dispute handling, backup continuity, or audit purposes. Questions regarding privacy practices may be directed through the platform contact channel or the support address displayed in the site footer.",
      },
    ]}
  />
);

export default Privacy;
