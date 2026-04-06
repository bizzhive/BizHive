import LearnPage from "@/components/LearnPage";
import { planChapters } from "@/content/learning";

const PlanLearn = () => (
  <LearnPage
    title="Planning learn track"
    subtitle="Fifteen structured chapters for validation, market understanding, customer clarity, pricing, and planning discipline."
    chapters={planChapters}
    pageSlug="plan-learn"
  />
);

export default PlanLearn;
