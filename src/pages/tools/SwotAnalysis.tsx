import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const SwotAnalysis = () => (
  <RouteDetailPage
    eyebrow="Tool"
    title="SWOT analysis"
    description="Map strengths, weaknesses, opportunities, and threats in a calmer layout that is easier to discuss with a team."
    sections={[
      {
        title: "Internal strengths",
        body: "Capture the capabilities, unfair advantages, and execution strengths the business can already lean on.",
      },
      {
        title: "Internal weaknesses",
        body: "Acknowledge gaps in resources, credibility, process, or knowledge before they block growth later.",
      },
      {
        title: "External forces",
        body: "Track the opportunities and threats shaping demand, competition, and timing in the market.",
      },
    ]}
  />
);

export default SwotAnalysis;
