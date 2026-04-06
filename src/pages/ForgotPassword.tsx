import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/AuthShell";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.resetEmailSentTitle"), description: t("auth.resetEmailSentBody") });
    }
    setLoading(false);
  };

  return (
    <AuthShell title={t("auth.forgotTitle")} body={t("auth.forgotBody")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder={t("auth.placeholders.email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-2xl"
          required
        />
        <Button type="submit" className="h-12 w-full rounded-2xl" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.actions.sendResetLink")}
        </Button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
