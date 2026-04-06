import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const BusinessCanvas = () => (
  <RouteDetailPage
    eyebrow="Tool"
    title="Business canvas"
    description="Map the value proposition, customer segments, key activities, and channels in one cleaner working surface."
    sections={[
      {
        title: "Customer and value",
        body: "Capture the customer segment and the value you are promising to deliver in concise, reviewable blocks.",
      },
      {
        title: "Business model",
        body: "Keep revenue logic, cost structure, and important activities visible without expanding the page forever.",
      },
      {
        title: "Save and revisit",
        body: "Canvas work is easier to save and reopen from the dashboard as the product matures.",
      },
    ]}
  />
);

export default BusinessCanvas;
