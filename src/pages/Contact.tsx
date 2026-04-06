import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_submissions").insert({
      ...form,
      category: "general",
    });

    if (error) {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("contact.sentTitle"), description: t("contact.sentBody") });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.title")} description={t("contact.description")} />
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Surface className="space-y-4">
            <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">{t("contact.topicsTitle")}</div>
            <div className="grid gap-3">
              {(t("contact.topics", { returnObjects: true }) as string[]).map((item) => (
                <div key={item} className="rounded-2xl border border-border/80 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </Surface>

          <Surface>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder={t("contact.fields.name")}
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="h-12 rounded-2xl"
                  required
                />
                <Input
                  type="email"
                  placeholder={t("contact.fields.email")}
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="h-12 rounded-2xl"
                  required
                />
              </div>
              <Input
                placeholder={t("contact.fields.subject")}
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                className="h-12 rounded-2xl"
                required
              />
              <Textarea
                placeholder={t("contact.fields.message")}
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                className="min-h-[180px] rounded-2xl"
                required
              />
              <Button type="submit" className="h-12 rounded-2xl" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("contact.submit")}
              </Button>
            </form>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Contact;
