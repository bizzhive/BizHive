import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
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
    } else {
        toast({ title: t("Error"), description: t("Could not find the email for verification."), variant: "destructive"});
    }
  }, [t, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResending && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResending(false);
      setTimer(30); // Reset timer
    }
    return () => clearInterval(interval);
  }, [isResending, timer]);

  const handleResend = async () => {
    if (email && !isResending) {
      try {
        await resendVerificationEmail(email);
        setIsResending(true);
      } catch (error) {
        // Error is already handled by the context, but we can reset the timer here if needed
        setIsResending(false);
        setTimer(30);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4"><MailCheck className="h-12 w-12 text-primary" /></div>
          <CardTitle>{t("Verify Your Email")}</CardTitle>
          <CardDescription>
            {t("We've sent a verification link to")} <strong>{email || t("your email address")}</strong>. {t("Please check your inbox and click the link to activate your account.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("Didn't receive an email?")}{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={handleResend}
              disabled={isResending || !email}
            >
              {isResending ? `${t("Resend verification link")} (${timer}s)` : t("Resend verification link")}
            </Button>
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link to="/login">{t("Back to Login")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
