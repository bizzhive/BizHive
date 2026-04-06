import { LegalPage } from "@/components/site/LegalPage";

const RefundPolicy = () => (
  <LegalPage
    title="Refund Policy"
    description="This Refund Policy describes the general position BizHive intends to apply to paid subscriptions, digital services, premium access, and paid resources if and when such offerings become commercially available."
    sections={[
      {
        title: "General refund framework",
        body: "Any paid BizHive offering introduced in the future may carry plan-specific billing terms, renewal rules, access conditions, and refund eligibility criteria shown at checkout or in accompanying plan documentation. Unless a more specific policy states otherwise, charges for periods or benefits already consumed may be treated as non-refundable to the extent permitted by applicable law.",
      },
      {
        title: "Subscriptions and recurring billing",
        body: "If recurring subscriptions are introduced, users will generally be expected to cancel before the next billing cycle to avoid renewal charges for subsequent periods. Access that remains available during an already-billed service period may not automatically entitle the user to a pro-rated refund unless required by law, explicitly promised at checkout, or approved by BizHive in response to a verified issue.",
      },
      {
        title: "Digital resources, templates, and premium content",
        body: "Refund treatment for digital resources, downloadable packs, templates, educational materials, or premium content may depend on whether access has already been granted, downloaded, or materially consumed. Once a digital product has been delivered or substantially accessed, refund eligibility may be restricted, subject to mandatory consumer-protection rules or case-specific review.",
      },
      {
        title: "Billing errors and service failures",
        body: "If a user experiences a duplicate charge, technical billing error, or material failure to access a purchased service, BizHive may review the circumstances and, where appropriate, issue a correction, credit, refund, extension, or other commercially reasonable remedy. Supporting payment details, dates, and account identifiers may be required to investigate such cases.",
      },
    ]}
  />
);

export default RefundPolicy;
