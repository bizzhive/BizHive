import { useState } from "react";
import { Clock, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const contactInfo = [
  {
    icon: Mail,
    title: "Email support",
    details: "bizzhive.support@gmail.com",
    description: "Best for product questions, support requests, and document issues.",
  },
  {
    icon: Phone,
    title: "Phone support",
    details: "+91 XXXXX XXXXX",
    description: "Use this for time-sensitive guidance during business hours.",
  },
  {
    icon: Clock,
    title: "Business hours",
    details: "Monday to Friday",
    description: "9:00 AM to 6:00 PM IST",
  },
];

const faqItems = [
  {
    question: "How can I access premium features?",
    answer: "Create an account, complete your workspace setup, and upgrade when premium access is enabled for your plan.",
  },
  {
    question: "Is BizHive suitable for all business types?",
    answer: "BizHive is positioned for Indian founders, freelancers, and small businesses across multiple industries.",
  },
  {
    question: "Do you provide legal advice?",
    answer: "BizHive provides legal information and editable templates, but not personalized legal representation.",
  },
  {
    question: "How accurate is the business planning information?",
    answer: "The content is designed as practical guidance and should still be reviewed against your exact business situation when stakes are high.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
      });

      if (error) {
        throw error;
      }

      toast({
        title: t("Message sent"),
        description: t("We'll get back to you within 24 hours."),
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.message || t("Failed to send message"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Contact"
          title={t("Reach BizHive without guessing where to start")}
          description={t("The contact flow now follows the same layout system as the rest of the product: one clear form, one support hierarchy, and clearer expectations about response and usage.")}
          actions={
            <div className="rounded-[22px] border border-border/70 bg-background/72 px-4 py-3 text-sm leading-6 text-muted-foreground">
              <div className="font-semibold text-foreground">{t("Support expectation")}</div>
              <div>{t("Use the form for structured requests and email for direct follow-up when needed.")}</div>
            </div>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Support form"
              title={t("Send a structured request")}
              description={t("This form now reads like a product workflow instead of a generic contact box, with clearer labels and better visual alignment.")}
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">{t("Full name")}</Label>
                  <Input
                    id="contact-name"
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder={t("Your full name")}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t("Email address")}</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-category">{t("Category")}</Label>
                <select
                  id="contact-category"
                  value={formData.category}
                  onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
                  className="flex h-12 w-full rounded-2xl border border-border/70 bg-muted/35 px-4 text-sm text-foreground"
                >
                  <option value="general">{t("General inquiry")}</option>
                  <option value="technical">{t("Technical support")}</option>
                  <option value="business">{t("Business consultation")}</option>
                  <option value="premium">{t("Premium features")}</option>
                  <option value="partnership">{t("Partnership")}</option>
                  <option value="feedback">{t("Feedback")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject">{t("Subject")}</Label>
                <Input
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                  placeholder={t("Brief description of your request")}
                  className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">{t("Message")}</Label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  placeholder={t("Share the details, context, and what outcome you need.")}
                  className="min-h-[180px] rounded-[24px] border-border/70 bg-muted/35 px-4 py-3"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("Structured contact submissions are saved into the admin workspace so follow-up is easier to manage.")}
                </p>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? t("Sending...") : t("Send message")}
                </Button>
              </div>
            </form>
          </Surface>

          <div className="space-y-6">
            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Support channels"
                title={t("Choose the right contact path")}
                description={t("This makes the contact area easier to scan and gives each support channel a clearer job.")}
              />
              <div className="mt-6 space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-[22px] border border-border/70 bg-muted/20 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{t(item.title)}</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{item.details}</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Quick answers"
                title={t("Answer the common questions early")}
                description={t("These answers reduce contact friction and give the page a more complete support experience.")}
              />
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <div key={item.question} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{t(item.question)}</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.answer)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Contact;
