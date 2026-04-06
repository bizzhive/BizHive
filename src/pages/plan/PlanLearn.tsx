import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const PlanLearn = () => (
  <RouteDetailPage
    eyebrow="Learn"
    title="Planning learn track"
    description="A structured learning track for founders who need the basics of validation, market understanding, and strategy laid out clearly."
    sections={[
      {
        title: "Problem first",
        body: "Start with the customer problem and the frequency of pain before writing product language.",
      },
      {
        title: "Signal gathering",
        body: "Learn how to collect useful evidence from calls, pilots, demos, and lightweight experiments.",
      },
      {
        title: "Decision framing",
        body: "Turn lessons into concrete decisions around positioning, pricing, and what to build next.",
      },
    ]}
  />
);

export default PlanLearn;
