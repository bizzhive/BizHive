import LearnPage from "@/components/LearnPage";
import { growChapters } from "@/content/learning";

const ManageLearn = () => (
  <LearnPage
    title="Growth learn track"
    subtitle="Fifteen chapters for operating rhythm, metrics, team clarity, funding readiness, and durable business growth."
    chapters={growChapters}
    pageSlug="manage-learn"
  />
);

export default ManageLearn;
