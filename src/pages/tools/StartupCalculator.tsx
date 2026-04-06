import { useEffect, useMemo, useState } from "react";
import { Calculator, PiggyBank, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAssistButton } from "@/components/AIAssistButton";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useSavedTool } from "@/hooks/use-saved-tool";

const defaultData = {
  setupCost: 250000,
  monthlyOperatingCost: 80000,
  projectedMonthlyRevenue: 120000,
  availableCapital: 600000,
  note: "",
};

const StartupCalculator = () => {
  const { data, save, isSaving } = useSavedTool("startup_calculator", defaultData);
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const metrics = useMemo(() => {
    const monthlyBurn = Math.max(form.monthlyOperatingCost - form.projectedMonthlyRevenue, 0);
    const runwayMonths = monthlyBurn > 0 ? Math.floor((form.availableCapital - form.setupCost) / monthlyBurn) : 99;
    const paybackMonths = form.projectedMonthlyRevenue > 0 ? Math.ceil((form.setupCost + form.availableCapital * 0.15) / form.projectedMonthlyRevenue) : 0;
    return {
      monthlyBurn,
      runwayMonths: runwayMonths < 0 ? 0 : runwayMonths,
      paybackMonths,
    };
  }, [form]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Finance tool"
          title="Startup calculator"
          description="Estimate setup cost, monthly burn, runway, and capital pressure in a compact finance workspace you can actually save."
          icon={Calculator}
          visual={<ClayGraphic className="h-full min-h-[240px]" compact />}
          actions={
            <Button className="h-12 rounded-2xl px-5" onClick={() => save(form)} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save calculator"}
            </Button>
          }
        />

        <section className="workspace-grid">
          <ScrollSurface className="lg:h-[42rem]">
            <div className="compact-scroll space-y-4">
              <div className="panel-muted p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Founding cost assumptions</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Start with real numbers for setup cost, monthly spend, expected revenue, and available capital.
                    </p>
                  </div>
                  <AIAssistButton
                    field="startup calculator assumptions"
                    context={form}
                    onSuggestion={(suggestion) => setForm((current) => ({ ...current, note: suggestion }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["setupCost", "One-time setup cost"],
                    ["monthlyOperatingCost", "Monthly operating cost"],
                    ["projectedMonthlyRevenue", "Projected monthly revenue"],
                    ["availableCapital", "Available capital"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-2">
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <Input
                        type="number"
                        value={form[field as keyof typeof form]}
                        onChange={(event) => setForm((current) => ({ ...current, [field]: Number(event.target.value || 0) }))}
                        className="h-12 rounded-[22px]"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-semibold text-foreground">Founder note</span>
                  <Input
                    value={form.note}
                    onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                    placeholder="What assumption are you least confident about?"
                    className="h-12 rounded-[22px]"
                  />
                </label>
              </div>
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Output snapshot</div>
                  <p className="text-sm text-muted-foreground">Use these numbers to pressure-test early viability.</p>
                </div>
              </div>
              {[
                ["Monthly burn", formatCurrency(metrics.monthlyBurn)],
                ["Estimated runway", metrics.runwayMonths >= 99 ? "Self-funded / profitable" : `${metrics.runwayMonths} months`],
                ["Rough payback", metrics.paybackMonths ? `${metrics.paybackMonths} months` : "Not available"],
              ].map(([label, value]) => (
                <div key={label} className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </Surface>

            <Surface className="space-y-3">
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">What to do with this</div>
              <p className="text-sm leading-7 text-muted-foreground">
                If runway is short, cut launch scope or validate faster before spending. If payback is too slow, revisit pricing or the offer design.
              </p>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default StartupCalculator;
