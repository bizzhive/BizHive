import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const MarketResearch = () => (
  <RouteDetailPage
    eyebrow="Plan detail"
    title="Market research workspace"
    description="Customer demand, competitors, and pricing signals should sit in one readable view instead of being scattered across notes."
    sections={[
      {
        title: "Customer segments",
        body: "Define who feels the pain most often, what buying trigger starts the search, and what outcomes matter enough to pay for.",
      },
      {
        title: "Competitor map",
        body: "Track direct competitors, substitutes, manual workflows, and pricing expectations in one sheet you can actually review.",
      },
      {
        title: "Decision summary",
        body: "Translate research into positioning, pricing direction, and which founder assumptions still need testing before launch.",
      },
    ]}
  />
);

export default MarketResearch;
