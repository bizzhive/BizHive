import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const FinancialCalculator = () => (
  <RouteDetailPage
    eyebrow="Tool"
    title="Financial calculator"
    description="Run cleaner startup math around cost, pricing, and revenue assumptions without the page looking like a separate app."
    sections={[
      {
        title: "Revenue scenarios",
        body: "Test realistic sales assumptions, price points, and revenue expectations with clearer fields and output blocks.",
      },
      {
        title: "Cost visibility",
        body: "Track operating costs and see how they affect margin, runway, and pricing comfort.",
      },
      {
        title: "Decision support",
        body: "Use the outputs to guide pricing, staffing, and launch timing decisions instead of treating the tool as an isolated calculator.",
      },
    ]}
  />
);

export default FinancialCalculator;
