import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const PitchDeckBuilder = () => (
  <RouteDetailPage
    eyebrow="Tool"
    title="Pitch deck builder"
    description="Structure the investor story with cleaner slide logic, less clutter, and stronger links back to the growth track."
    sections={[
      {
        title: "Narrative flow",
        body: "Start with problem, solution, market, traction, and team so the deck follows the questions investors actually ask.",
      },
      {
        title: "Evidence",
        body: "Highlight traction, proof points, and market understanding instead of filling the deck with decorative claims.",
      },
      {
        title: "Funding ask",
        body: "Explain what you are raising, what it funds, and what milestones the team will hit with that runway.",
      },
    ]}
  />
);

export default PitchDeckBuilder;
