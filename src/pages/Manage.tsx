import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InfoWorkspacePage, type InfoWorkspaceSection } from "@/components/site/InfoWorkspacePage";

const Manage = () => {
  const { t } = useTranslation();
  const sections = useMemo(
    () => t("grow.sections", { returnObjects: true }) as InfoWorkspaceSection[],
    [t]
  );

  return (
    <InfoWorkspacePage
      eyebrow={t("grow.eyebrow")}
      title={t("grow.title")}
      description={t("grow.description")}
      visualIcon={TrendingUp}
      visualTitle={t("grow.visualTitle")}
      actions={[
        { href: "/incubators", label: t("grow.actions.funding") },
        { href: "/tools", label: t("grow.actions.tools") },
        { href: "/manage/learn", label: t("grow.actions.learn") },
      ]}
      highlights={sections.map((section) => ({ label: section.title, body: section.body }))}
    />
  );
};

export default Manage;
