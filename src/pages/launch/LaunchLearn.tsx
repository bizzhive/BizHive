import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const LaunchLearn = () => (
  <RouteDetailPage
    eyebrow="Learn"
    title="Launch learn track"
    description="A compact guide to registrations, operating prep, and what launch readiness actually looks like for a small team."
    sections={[
      {
        title: "Operational basics",
        body: "Understand the registrations, workflows, and team responsibilities that need to be in place before launch.",
      },
      {
        title: "Risk reduction",
        body: "Use simple legal and tax preparation to reduce avoidable delays and mistakes right before go-live.",
      },
      {
        title: "Go-live sequencing",
        body: "Coordinate announcements, onboarding, customer-facing materials, and internal checklists in the right order.",
      },
    ]}
  />
);

export default LaunchLearn;
