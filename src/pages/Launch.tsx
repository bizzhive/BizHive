import { Rocket } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InfoWorkspacePage, type InfoWorkspaceSection } from "@/components/site/InfoWorkspacePage";

const Launch = () => {
  const { t } = useTranslation();
  const sections = useMemo(
    () => t("launch.sections", { returnObjects: true }) as InfoWorkspaceSection[],
    [t]
  );

  return (
    <InfoWorkspacePage
      eyebrow={t("launch.eyebrow")}
      title={t("launch.title")}
      description={t("launch.description")}
      visualIcon={Rocket}
      visualTitle={t("launch.visualTitle")}
      actions={[
        { href: "/legal", label: t("launch.actions.legal") },
        { href: "/taxation", label: t("launch.actions.taxation") },
        { href: "/launch/learn", label: t("launch.actions.learn") },
      ]}
      highlights={sections.map((section) => ({ label: section.title, body: section.body }))}
    />
  );
};

export default Launch;
