import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSent(true);
    } catch (error) {
      toast({
        title: t("Error"),
        description:
          error instanceof Error ? error.message : t("Failed to send reset email"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t("Account recovery")}
      title={t("Reset access without losing momentum")}
      description={t("Request a secure password reset link and return to your dashboard, plans, and onboarding workspace once you are back in.")}
      features={[
        {
          icon: <Mail className="h-5 w-5" />,
          title: t("One secure email"),
          description: t("We send the reset link directly to your account email so the recovery path stays simple and controlled."),
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: t("Protected workflow"),
          description: t("The password reset flow keeps your account secure while still getting you back to work quickly."),
        },
        {
          icon: <Sparkles className="h-5 w-5" />,
          title: t("Back into BizHive fast"),
          description: t("Once the password is updated, you can continue with the same dashboard, profile, and planning tools immediately."),
        },
      ]}
      footer={t("Use the same email tied to your BizHive account so the reset link lands in the right inbox.")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/70 px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
              {sent ? t("Check Your Email") : t("Forgot Password")}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              {sent
                ? `${t("We've sent a password reset link to")} ${email}.`
                : t("Enter your account email and we will send you a reset link that opens the secure password update screen.")}
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
          {sent ? (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-border/70 bg-muted/28 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {t("Didn't receive it? Check your spam folder or request a new link in a moment.")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl px-5"
                  onClick={() => setSent(false)}
                >
                  {t("Try Again")}
                </Button>
                <Button asChild className="h-11 rounded-2xl px-5">
                  <Link to="/login">{t("Back to Login")}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recovery-email">{t("Email")}</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  required
                />
              </div>

              <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                {isLoading ? t("Sending...") : t("Send Reset Link")}
              </Button>
            </form>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Back to Login")}
            </Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default ForgotPassword;
