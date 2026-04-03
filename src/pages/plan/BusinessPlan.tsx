import { useMemo, useState } from "react";
import { Calendar, DollarSign, FileText, Megaphone, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistButton } from "@/components/AIAssistButton";
import { PageHeader, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const emptyGoal = {
  goal: "",
  specific: "",
  measurable: "",
  achievable: "",
  relevant: "",
  timeBound: "",
};

const BusinessPlan = () => {
  const [businessPlan, setBusinessPlan] = useState({
    executiveSummary: "",
    businessDescription: "",
    marketAnalysis: "",
    organizationManagement: "",
    serviceProduct: "",
    marketingPlan: "",
    fundingRequest: "",
    financialProjections: "",
    appendix: "",
  });
  const [goals, setGoals] = useState([emptyGoal]);

  const updatePlan = (field: keyof typeof businessPlan, value: string) => {
    setBusinessPlan((previous) => ({ ...previous, [field]: value }));
  };

  const addGoal = () => {
    setGoals((previous) => [...previous, emptyGoal]);
  };

  const updateGoal = (index: number, field: keyof typeof emptyGoal, value: string) => {
    setGoals((previous) => previous.map((goal, goalIndex) => (goalIndex === index ? { ...goal, [field]: value } : goal)));
  };

  const completedSections = useMemo(() => {
    const fields = Object.values(businessPlan).filter((value) => value.trim().length > 0).length;
    const goalFields = goals.flatMap((goal) => Object.values(goal)).filter((value) => value.trim().length > 0).length;
    return fields + goalFields;
  }, [businessPlan, goals]);

  const generatePlan = () => {
    toast.success("Business plan structure updated. Export workflow can be added in the next phase.");
  };

  const completionLabel = `${completedSections} fields completed`;

  return (
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Business plan generator"
          title="A more compact workspace for your business narrative"
          description="This page now groups the plan into clearer sections, reduces visual drift, and keeps planning context visible while you write."
          actions={
            <>
              <Button size="lg" onClick={generatePlan}>
                Generate Plan Draft
              </Button>
              <div className="rounded-2xl border border-border/70 bg-background/72 px-4 py-3 text-sm font-medium text-foreground">
                {completionLabel}
              </div>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <Surface className="space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Planner overview
              </div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                Your plan should read like one story
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Work through the sections in order, keep the story tight, and use the side panels as structure instead of filler.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                {
                  title: "Executive clarity",
                  description: "Lead with the business opportunity, the model, and what makes it viable.",
                },
                {
                  title: "Goal discipline",
                  description: "Translate ambition into measurable milestones instead of vague aspirations.",
                },
                {
                  title: "Financial logic",
                  description: "Show how revenue, cost, and funding connect to your growth path.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-lg font-semibold tracking-[-0.04em] text-foreground">
                    {item.title}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-border/70 bg-muted/22 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Working note
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Use this page to create a strong internal plan first. Export, polished formatting, and deeper evaluation logic can be layered on later without changing the structure again.
              </p>
            </div>
          </Surface>

          <Tabs defaultValue="executive-summary" className="space-y-5">
            <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-[28px] border border-border/70 bg-card/88 p-2 md:grid-cols-4">
              <TabsTrigger value="executive-summary" className="rounded-[20px] py-3">
                Executive Summary
              </TabsTrigger>
              <TabsTrigger value="goals" className="rounded-[20px] py-3">
                Business Goals
              </TabsTrigger>
              <TabsTrigger value="financial" className="rounded-[20px] py-3">
                Financial Plan
              </TabsTrigger>
              <TabsTrigger value="marketing" className="rounded-[20px] py-3">
                Marketing Strategy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="executive-summary" className="space-y-5">
              <Card className="border-border/70 bg-card/88">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Executive Summary & Business Description
                  </CardTitle>
                  <CardDescription>
                    Capture the opportunity, the model, the market, and the operating structure with enough detail to guide real decisions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  {[
                    {
                      label: "Executive Summary",
                      field: "executiveSummary",
                      placeholder: "Brief overview of your business, mission, traction, and why this should exist.",
                    },
                    {
                      label: "Business Description",
                      field: "businessDescription",
                      placeholder: "What the company does, who it serves, and what problem it solves.",
                    },
                    {
                      label: "Market Analysis",
                      field: "marketAnalysis",
                      placeholder: "Target audience, market size, competitors, and the opening you see.",
                    },
                    {
                      label: "Organization & Management",
                      field: "organizationManagement",
                      placeholder: "Ownership, team structure, responsibilities, and operational setup.",
                    },
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="text-sm font-semibold text-foreground">{item.label}</Label>
                        <AIAssistButton
                          field={item.label}
                          onSuggestion={(suggestion) => updatePlan(item.field as keyof typeof businessPlan, suggestion)}
                        />
                      </div>
                      <Textarea
                        placeholder={item.placeholder}
                        className="min-h-[150px] rounded-[22px] border-border/70 bg-muted/30"
                        value={businessPlan[item.field as keyof typeof businessPlan]}
                        onChange={(event) => updatePlan(item.field as keyof typeof businessPlan, event.target.value)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-5">
              <Card className="border-border/70 bg-card/88">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    SMART Business Goals
                  </CardTitle>
                  <CardDescription>
                    Build goals that are specific enough to drive action and measurable enough to review later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {goals.map((goal, index) => (
                    <div key={index} className="rounded-[24px] border border-border/70 bg-background/72 p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                            Goal {index + 1}
                          </h3>
                          <p className="text-sm text-muted-foreground">Translate ambition into execution criteria.</p>
                        </div>
                        {goals.length > 1 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGoals((previous) => previous.filter((_, goalIndex) => goalIndex !== index))}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </div>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Goal Statement</Label>
                          <Input
                            className="h-12 rounded-[22px] border-border/70 bg-muted/30"
                            placeholder="Example: Reach Rs. 5,00,000 in monthly revenue within 12 months."
                            value={goal.goal}
                            onChange={(event) => updateGoal(index, "goal", event.target.value)}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {[
                            ["specific", "Specific", "What exactly will be accomplished?"],
                            ["measurable", "Measurable", "How will progress be tracked?"],
                            ["achievable", "Achievable", "Why is this realistic?"],
                            ["relevant", "Relevant", "Why does this matter to the business now?"],
                          ].map(([field, label, placeholder]) => (
                            <div key={field} className="space-y-2">
                              <Label className="text-sm font-semibold text-foreground">{label}</Label>
                              <Textarea
                                className="min-h-[132px] rounded-[22px] border-border/70 bg-muted/30"
                                placeholder={placeholder}
                                value={goal[field as keyof typeof goal]}
                                onChange={(event) => updateGoal(index, field as keyof typeof goal, event.target.value)}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Time-bound</Label>
                          <Input
                            className="h-12 rounded-[22px] border-border/70 bg-muted/30"
                            placeholder="When will this goal be achieved?"
                            value={goal.timeBound}
                            onChange={(event) => updateGoal(index, "timeBound", event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full" onClick={addGoal}>
                    Add Another Goal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-5">
              <Card className="border-border/70 bg-card/88">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Financial Projections
                  </CardTitle>
                  <CardDescription>
                    Keep the plan readable: show revenue assumptions, expense logic, and the funding requirement clearly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["Year 1 Average Monthly Revenue", "100000"],
                      ["Year 2 Average Monthly Revenue", "200000"],
                      ["Year 3 Average Monthly Revenue", "350000"],
                      ["Operating Expenses", "50000"],
                      ["Salary & Benefits", "60000"],
                      ["Marketing & Advertising", "20000"],
                    ].map(([label, placeholder]) => (
                      <div key={label} className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">{label}</Label>
                        <Input
                          type="number"
                          className="h-12 rounded-[22px] border-border/70 bg-muted/30"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-sm font-semibold text-foreground">Funding Request</Label>
                      <AIAssistButton
                        field="Funding Request"
                        onSuggestion={(suggestion) => updatePlan("fundingRequest", suggestion)}
                      />
                    </div>
                    <Textarea
                      placeholder="Amount needed, how the funds will be used, and what milestone that funding unlocks."
                      className="min-h-[160px] rounded-[22px] border-border/70 bg-muted/30"
                      value={businessPlan.fundingRequest}
                      onChange={(event) => updatePlan("fundingRequest", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-sm font-semibold text-foreground">Financial Projections Narrative</Label>
                      <AIAssistButton
                        field="Financial Projections"
                        onSuggestion={(suggestion) => updatePlan("financialProjections", suggestion)}
                      />
                    </div>
                    <Textarea
                      placeholder="Describe your assumptions around pricing, margin, growth, and runway."
                      className="min-h-[160px] rounded-[22px] border-border/70 bg-muted/30"
                      value={businessPlan.financialProjections}
                      onChange={(event) => updatePlan("financialProjections", event.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketing" className="space-y-5">
              <Card className="border-border/70 bg-card/88">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    Marketing & Sales Strategy
                  </CardTitle>
                  <CardDescription>
                    Show how the product gets discovered, why customers trust it, and how revenue actually happens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-sm font-semibold text-foreground">Marketing Plan</Label>
                      <AIAssistButton
                        field="Marketing Plan"
                        onSuggestion={(suggestion) => updatePlan("marketingPlan", suggestion)}
                      />
                    </div>
                    <Textarea
                      placeholder="Target audience, acquisition channels, messaging angles, and campaign direction."
                      className="min-h-[180px] rounded-[22px] border-border/70 bg-muted/30"
                      value={businessPlan.marketingPlan}
                      onChange={(event) => updatePlan("marketingPlan", event.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-border/70 bg-background/72 p-5">
                      <div className="mb-3 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                        Digital channels
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        {["Social Media", "SEO", "Search Ads", "Email", "Content"].map((item) => (
                          <div key={item} className="rounded-2xl bg-muted/35 px-3 py-2">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-background/72 p-5">
                      <div className="mb-3 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                        Sales motion
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        {["Direct outreach", "Inbound leads", "Partnerships", "Referrals", "Retargeting"].map((item) => (
                          <div key={item} className="rounded-2xl bg-muted/35 px-3 py-2">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </SiteContainer>
    </div>
  );
};

export default BusinessPlan;
