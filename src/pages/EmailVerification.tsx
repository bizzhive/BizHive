import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const EmailVerification = () => {
  const { resendVerificationEmail } = useAuth();
  const { t } = useTranslation();
  const pendingEmail = useMemo(() => sessionStorage.getItem("pending_verification_email") || "", []);

  return (
    <AuthShell title={t("auth.verificationTitle")} body={t("auth.verificationBody")}>
      <div className="space-y-4">
        <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
          {pendingEmail
            ? t("auth.verificationSentTo", { email: pendingEmail })
            : t("auth.verificationCheckInbox")}
        </div>
        {pendingEmail ? (
          <Button className="h-12 w-full rounded-2xl" onClick={() => resendVerificationEmail(pendingEmail)}>
            {t("auth.actions.resendVerification")}
          </Button>
        ) : null}
      </div>
    </AuthShell>
  );
};

export default EmailVerification;
