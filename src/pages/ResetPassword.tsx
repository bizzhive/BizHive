import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/AuthShell";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.passwordUpdatedTitle"), description: t("auth.passwordUpdatedBody") });
    }
    setLoading(false);
  };

  return (
    <AuthShell title={t("auth.resetTitle")} body={t("auth.resetBody")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder={t("auth.placeholders.newPassword")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-2xl"
          required
        />
        <Button type="submit" className="h-12 w-full rounded-2xl" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.actions.savePassword")}
        </Button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
