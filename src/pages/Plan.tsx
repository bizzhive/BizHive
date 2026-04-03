import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  FileCheck,
  Layers3,
  Lightbulb,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FAQSection from "@/components/FAQSection";
import { PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

const planFAQs = [
  {
    question: "Why is business planning important?",
    answer:
      "A solid business plan helps you define your vision, understand your market, secure funding, and create a roadmap for growth. Studies show that entrepreneurs who plan are more likely to achieve viability than those who don't.",
  },
  {
    question: "What business structure should I choose in India?",
    answer:
      "It depends on your goals. Sole Proprietorship is simple for freelancers, LLP works well for partnerships with limited liability, and Private Limited is often better for startups seeking funding.",
  },
  {
    question: "How long does it take to register a business in India?",
    answer:
      "It varies by structure. Sole proprietorships are the fastest, while LLP and Private Limited registrations take longer because of name approval, documentation, and incorporation steps.",
  },
  {
    question: "Do I need a CA or lawyer to start a business?",
    answer:
      "Not always, but professional review is strongly recommended for registrations, tax planning, and any document that creates legal obligations.",
  },
  {
    question: "How much does it cost to start a business in India?",
    answer:
      "Costs depend on your structure, compliance needs, and operating model. Use the startup and financial tools to estimate setup plus the first few months of runway together.",
  },
];

const planWorkflows = [
  {
    icon: Search,
    title: "Market research",
    description: "Validate demand, understand customer behavior, and map competitors before making expensive bets.",
    href: "/plan/market-research",
    bullets: [
      "Target market identification",
      "Competitor analysis tools",
      "Demand and positioning checks",
    ],
  },
  {
    icon: FileCheck,
    title: "Business plan builder",
    description: "Turn assumptions into a real operating plan with clearer sections and more consistent outputs.",
    href: "/plan/business-plan",
    bullets: [
      "Business goals and strategy",
      "Financial projections",
      "Operational planning",
    ],
  },
  {
    icon: Target,
    title: "Structure and registration",
    description: "Move from idea to legal setup with connected compliance, filing, and document flows.",
    href: "/legal",
    bullets: [
      "Business structure selection",
      "Registration preparation",
      "Draft-first legal workflows",
    ],
  },
];

const planningSignals = [
  {
    label: "Core outputs",
    value: "3",
    description: "Research, plan, and registration now sit in one connected planning narrative.",
  },
  {
    label: "Decision lens",
    value: "5",
    description: "Every founder plan should clarify customer, model, economics, structure, and timing.",
  },
  {
    label: "Planning bias",
    value: "Low",
    description: "The page now focuses on clear next actions instead of vague startup inspiration.",
  },
];

const processSteps = [
  { step: "01", title: "Research reality", description: "Confirm the problem, urgency, and buyer before building too much." },
  { step: "02", title: "Map the model", description: "Define offer, channels, customers, pricing, and operating assumptions." },
  { step: "03", title: "Choose structure", description: "Pick the legal and tax setup that matches how you want to grow." },
  { step: "04", title: "Stress test", description: "Run the numbers, risks, and dependencies before you commit money." },
  { step: "05", title: "Move to launch", description: "Hand off a cleaner plan into launch, documents, and growth workflows." },
];

const quickTools = [
  { icon: Layers3, label: "Business canvas", href: "/tools/business-canvas" },
  { icon: TrendingUp, label: "SWOT analysis", href: "/tools/swot-analysis" },
  { icon: Calculator, label: "Financial calculator", href: "/tools/financial-calculator" },
  { icon: BadgeCheck, label: "Learning hub", href: "/plan/learn" },
];

const Plan = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Plan"
          title={t("Design the business before you spend the money")}
          description={t("Planning in BizHive now feels like an intentional operating phase: clearer structure, cleaner hierarchy, and tighter links between research, planning, tools, and legal setup.")}
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/plan/market-research">{t("Start market research")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/plan/business-plan">{t("Open business plan")}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Why this phase matters"
              title={t("Good planning reduces expensive guessing")}
              description={t("The planning surface now explains what this stage is for, what decisions it unlocks, and where founders should go next inside the product.")}
            />
            <div className="space-y-4">
              {[
                {
                  title: "Clarity before execution",
                  description: "Planning forces the business model, customer, and economics into one visible frame before launch pressure takes over.",
                },
                {
                  title: "Better funding conversations",
                  description: "Investors and advisors react more confidently when your strategy, assumptions, and risks are already structured.",
                },
                {
                  title: "Less accidental work",
                  description: "The page is now designed to move you into the right next tool instead of scattering attention across disconnected cards.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-semibold text-foreground">{t(item.title)}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Planning signals"
                title={t("One phase, one stronger operating story")}
                description={t("These indicators summarize the planning layer so the page feels like a system, not just a collection of navigation cards.")}
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {t("Foundation stage")}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {planningSignals.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {t(item.value)}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">{t(item.label)}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Core workflows"
            title={t("Use the planning tools in the right order")}
            description={t("These cards now behave like a sequence: validate, structure, then formalize.")}
          />
          <div className="grid gap-5 xl:grid-cols-3">
            {planWorkflows.map((workflow) => (
              <Surface key={workflow.title} className="flex h-full flex-col p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                  <workflow.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {t(workflow.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(workflow.description)}</p>
                <div className="mt-5 space-y-3">
                  {workflow.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>{t(bullet)}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-6 w-full">
                  <Link to={workflow.href}>
                    {t("Open workflow")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Surface>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Planning sequence"
              title={t("A more deliberate five-step path")}
              description={t("This removes the old patchwork feel and gives the page a cleaner process backbone.")}
            />
            <div className="grid gap-4 md:grid-cols-5">
              {processSteps.map((item) => (
                <div key={item.step} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{item.step}</div>
                  <div className="mt-3 font-semibold text-foreground">{t(item.title)}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.description)}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Quick tools"
              title={t("Support the plan with adjacent tools")}
              description={t("These shortcuts keep the page useful without making it feel crowded or structurally loose.")}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {quickTools.map((tool) => (
                <Button key={tool.href} asChild variant="outline" className="h-auto justify-start rounded-[22px] px-4 py-4">
                  <Link to={tool.href} className="flex w-full items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">{t(tool.label)}</span>
                  </Link>
                </Button>
              ))}
            </div>
            <div className="rounded-[22px] border border-border/70 bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t("Flow note")}</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t("A strong plan should now naturally hand off into launch and legal work instead of forcing founders to guess where to go next.")}
                  </p>
                </div>
              </div>
            </div>
          </Surface>
        </section>

        <FAQSection items={planFAQs} />
      </SiteContainer>
    </div>
  );
};

export default Plan;
