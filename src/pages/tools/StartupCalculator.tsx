import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const StartupCalculator = () => (
  <RouteDetailPage
    eyebrow="Tool"
    title="Startup calculator"
    description="Use this tool for early startup cost checks, simple burn math, and practical business planning."
    sections={[
      {
        title: "Setup costs",
        body: "Estimate what it takes to get the business off the ground without underestimating the basics.",
      },
      {
        title: "Runway",
        body: "Model cash burn, monthly commitments, and how long the business can operate before new revenue arrives.",
      },
      {
        title: "Planning context",
        body: "Tie the calculator back into launch and growth decisions instead of treating it as a one-off widget.",
      },
    ]}
  />
);

export default StartupCalculator;
