import LearnPage from "@/components/LearnPage";
import { resourcesChapters } from "@/content/learning";

const ResourcesLearn = () => (
  <LearnPage
    title="Resource navigation guide"
    subtitle="A guided walkthrough of how the library, blog, documents, and community should support real founder work."
    chapters={resourcesChapters}
    pageSlug="resources-learn"
  />
);

export default ResourcesLearn;
