import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck, ShieldCheck, TimerReset } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const EmailVerification = () => {
  const { resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("pending_verification_email");
    if (storedEmail) {
      setEmail(storedEmail);
      return;
    }

    toast({
      title: t("Error"),
      description: t("Could not find the email for verification."),
      variant: "destructive",
    });
  }, [t, toast]);

  useEffect(() => {
    if (!isResending || timer <= 0) {
      if (timer === 0) {
        setIsResending(false);
        setTimer(30);
      }
      return;
    }

    const interval = window.setInterval(() => {
      setTimer((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isResending, timer]);

  const handleResend = async () => {
    if (!email || isResending) {
      return;
    }

    try {
      await resendVerificationEmail(email);
      setIsResending(true);
    } catch {
      setIsResending(false);
      setTimer(30);
    }
  };

  return (
    <AuthShell
      eyebrow={t("Verification")}
      title={t("Confirm your email to unlock BizHive")}
      description={t("We sent a verification link so your workspace can stay secure and your dashboard setup can continue without interruption.")}
      features={[
        {
          icon: <MailCheck className="h-5 w-5" />,
          title: t("Check your inbox"),
          description: t("Open the latest verification email from BizHive and click the activation link."),
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: t("Secure account handoff"),
          description: t("Once verified, you can sign in and continue with profile setup, language sync, and dashboard onboarding."),
        },
        {
          icon: <TimerReset className="h-5 w-5" />,
          title: t("Need a new link?"),
          description: t("You can resend the verification email from this screen without restarting the sign-up flow."),
        },
      ]}
      footer={t("Email verification is required before the rest of the product setup can feel reliable and personalized.")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/70 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
            <MailCheck className="h-7 w-7" />
          </div>
          <div className="mt-5 space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
              {t("Verify Your Email")}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              {t("We've sent a verification link to")}{" "}
              <span className="font-semibold text-foreground">
                {email || t("your email address")}
              </span>
              . {t("Please check your inbox and click the link to activate your account.")}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6 sm:px-8 sm:py-8">
          <div className="rounded-[24px] border border-border/70 bg-muted/28 p-5">
            <h3 className="font-semibold text-foreground">{t("What to do next")}</h3>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>1. {t("Open your inbox or spam folder and look for the BizHive verification email.")}</li>
              <li>2. {t("Click the verification link to confirm your account.")}</li>
              <li>3. {t("Return here only if you need a fresh link or want to go back to login.")}</li>
            </ol>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/80 p-5">
            <p className="text-sm leading-6 text-muted-foreground">
              {t("Didn't receive an email?")}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleResend}
                disabled={isResending || !email}
                className="h-11 rounded-2xl px-5"
              >
                {isResending
                  ? `${t("Resend verification link")} (${timer}s)`
                  : t("Resend verification link")}
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-2xl px-5">
                <Link to="/login">{t("Back to Login")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default EmailVerification;
