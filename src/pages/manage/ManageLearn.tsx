import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const ManageLearn = () => (
  <RouteDetailPage
    eyebrow="Learn"
    title="Growth learn track"
    description="A clearer learning track for operators who need discipline around metrics, execution, and scale readiness."
    sections={[
      {
        title: "Operating cadence",
        body: "Learn what to review weekly, which metrics matter early, and how to spot slippage before it becomes expensive.",
      },
      {
        title: "Team clarity",
        body: "Keep ownership, communication, and workflow expectations stable as the company starts to grow.",
      },
      {
        title: "Scale decisions",
        body: "Know when to invest deeper in channels, hiring, systems, and funding conversations.",
      },
    ]}
  />
);

export default ManageLearn;
