import { ClipboardList } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InfoWorkspacePage, type InfoWorkspaceSection } from "@/components/site/InfoWorkspacePage";

const Plan = () => {
  const { t } = useTranslation();
  const sections = useMemo(
    () => t("plan.sections", { returnObjects: true }) as InfoWorkspaceSection[],
    [t]
  );

  return (
    <InfoWorkspacePage
      eyebrow={t("plan.eyebrow")}
      title={t("plan.title")}
      description={t("plan.description")}
      visualIcon={ClipboardList}
      visualTitle={t("plan.visualTitle")}
      actions={[
        { href: "/plan/market-research", label: t("plan.actions.marketResearch") },
        { href: "/plan/business-plan", label: t("plan.actions.businessPlan") },
        { href: "/plan/learn", label: t("plan.actions.learn") },
      ]}
      highlights={sections.map((section) => ({ label: section.title, body: section.body }))}
    />
  );
};

export default Plan;
