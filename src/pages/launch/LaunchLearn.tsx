import LearnPage from "@/components/LearnPage";
import { launchChapters } from "@/content/learning";

const LaunchLearn = () => (
  <LearnPage
    title="Launch learn track"
    subtitle="Fifteen practical chapters covering business structure, registrations, launch readiness, legal basics, and a calm go-live workflow."
    chapters={launchChapters}
    pageSlug="launch-learn"
  />
);

export default LaunchLearn;
