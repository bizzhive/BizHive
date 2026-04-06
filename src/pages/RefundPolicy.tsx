import { LegalPage } from "@/components/site/LegalPage";

const RefundPolicy = () => (
  <LegalPage
    title="Refund Policy"
    description="This policy outlines the general refund and cancellation position for any paid BizHive plans, services, or subscriptions introduced on the platform."
    sections={[
      {
        title: "Subscription services",
        body: "If BizHive introduces paid subscriptions, the exact billing cycle, renewal logic, cancellation timing, and refund rules will be displayed at checkout and in the relevant plan documentation. Unless a separate plan-specific policy states otherwise, fees already consumed for active service periods may be non-refundable.",
      },
      {
        title: "Content and templates",
        body: "Refund eligibility for paid downloads, document packs, or advisory materials depends on the delivery model and any mandatory local consumer-protection rules. Digital access may become non-refundable once the material is delivered or materially consumed, unless law requires otherwise.",
      },
      {
        title: "Exceptions and support",
        body: "If there is a billing error, duplicate charge, or product access failure, contact support with transaction details so the case can be reviewed. BizHive may issue credits, reversals, or alternative remedies where appropriate.",
      },
    ]}
  />
);

export default RefundPolicy;
