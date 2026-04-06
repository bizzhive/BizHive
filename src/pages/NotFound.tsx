import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { EmptyState, SiteContainer } from "@/components/site/SitePrimitives";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer>
        <EmptyState
          title={t("notFound.title")}
          description={t("notFound.description")}
          action={
            <Button asChild className="rounded-2xl">
              <Link to="/">{t("notFound.backHome")}</Link>
            </Button>
          }
        />
      </SiteContainer>
    </div>
  );
};

export default NotFound;
