import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const BusinessPlan = () => (
  <RouteDetailPage
    eyebrow="Plan detail"
    title="Business plan builder"
    description="The business plan route now focuses on narrative clarity, operating assumptions, and cleaner section structure."
    sections={[
      {
        title: "Executive story",
        body: "Capture the problem, solution, customer, traction signal, and why the business is positioned to win.",
      },
      {
        title: "Operating model",
        body: "Lay out revenue logic, team assumptions, delivery model, and the metrics that make the business viable.",
      },
      {
        title: "Review and export",
        body: "Refine the plan in a more document-like layout that is easier to scan, save, and export later.",
      },
    ]}
  />
);

export default BusinessPlan;
