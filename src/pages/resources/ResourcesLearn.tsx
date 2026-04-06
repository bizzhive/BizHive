import { RouteDetailPage } from "@/components/site/RouteDetailPage";

const ResourcesLearn = () => (
  <RouteDetailPage
    eyebrow="Learn"
    title="Resource navigation guide"
    description="This route explains how documents, blogs, public legal pages, and community spaces are meant to support the founder journey."
    sections={[
      {
        title: "Documents",
        body: "Use the library for official links, practical templates, and saved document access instead of scattered downloads.",
      },
      {
        title: "Blogs",
        body: "Use the published blog as the public editorial layer for playbooks, explainers, and founder thinking.",
      },
      {
        title: "Community",
        body: "Use community rooms for ongoing discussions, updates, and peer questions without losing track of the active thread.",
      },
    ]}
  />
);

export default ResourcesLearn;
