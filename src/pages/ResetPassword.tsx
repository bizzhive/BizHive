import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Lock, ShieldCheck, TimerReset } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    const type = hashParams.get("type") ?? searchParams.get("type");

    if (type && type !== "recovery") {
      toast({
        title: t("Error"),
        description: t("This password reset link is not valid."),
        variant: "destructive",
      });
    }
  }, [t, toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t("Error"),
        description: t("Passwords do not match"),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t("Error"),
        description: t("Password must be at least 6 characters"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }

      setSuccess(true);
      window.setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error) {
      toast({
        title: t("Error"),
        description:
          error instanceof Error ? error.message : t("Failed to reset password"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow={t("Password update")}
      title={t("Set a stronger password and get back to work")}
      description={t("This screen finishes the recovery flow and sends you back into your BizHive workspace once your password is updated.")}
      features={[
        {
          icon: <Lock className="h-5 w-5" />,
          title: t("Secure reset"),
          description: t("Choose a fresh password that only you know and use it to protect your dashboard, plans, and documents."),
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: t("Protected handoff"),
          description: t("We only update the account after the recovery session is verified, so the reset flow remains controlled."),
        },
        {
          icon: <TimerReset className="h-5 w-5" />,
          title: t("Fast return"),
          description: t("After a successful reset, you are redirected back into the product so you can continue immediately."),
        },
      ]}
      footer={t("Choose a password you can remember and avoid reusing one from another service.")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/70 px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
              {success ? t("Password Reset!") : t("Set New Password")}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              {success
                ? t("Your password has been updated and we are taking you back to your dashboard.")
                : t("Create a new password below, confirm it, and finish the recovery flow in one step.")}
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
          {success ? (
            <div className="rounded-[24px] border border-border/70 bg-muted/28 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t("Redirecting...")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password">{t("New Password")}</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder={t("At least 6 characters")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("Confirm Password")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder={t("Repeat your password")}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                {isLoading ? t("Updating...") : t("Update Password")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
};

export default ResetPassword;
