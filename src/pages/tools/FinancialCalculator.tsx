import { useEffect, useMemo, useState } from "react";
import { BarChart3, Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAssistButton } from "@/components/AIAssistButton";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { useSavedTool } from "@/hooks/use-saved-tool";

const defaultData = {
  monthlyRevenue: 180000,
  monthlyCogs: 60000,
  monthlyExpenses: 80000,
  growthRate: 12,
  note: "",
};

const FinancialCalculator = () => {
  const { data, save, isSaving } = useSavedTool("financial_calculator", defaultData);
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const metrics = useMemo(() => {
    const grossProfit = form.monthlyRevenue - form.monthlyCogs;
    const netProfit = grossProfit - form.monthlyExpenses;
    const grossMargin = form.monthlyRevenue > 0 ? (grossProfit / form.monthlyRevenue) * 100 : 0;
    const annualRevenue = form.monthlyRevenue * 12 * (1 + form.growthRate / 100);
    return { annualRevenue, grossMargin, grossProfit, netProfit };
  }, [form]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Finance tool"
          title="Financial calculator"
          description="Model revenue, margin, and profitability with a clearer finance surface that stays connected to the rest of your saved workspace."
          icon={Wallet}
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
                    <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Monthly finance assumptions</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Capture top-line revenue, cost of delivery, operating expense, and the growth rate you believe is realistic.
                    </p>
                  </div>
                  <AIAssistButton
                    field="financial calculator assumptions"
                    context={form}
                    onSuggestion={(suggestion) => setForm((current) => ({ ...current, note: suggestion }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["monthlyRevenue", "Monthly revenue"],
                    ["monthlyCogs", "Monthly direct costs"],
                    ["monthlyExpenses", "Monthly operating expenses"],
                    ["growthRate", "Expected annual growth rate (%)"],
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
                    placeholder="Which number should Bee help you challenge next?"
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
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Financial snapshot</div>
                  <p className="text-sm text-muted-foreground">A compact view of the numbers you should review first.</p>
                </div>
              </div>
              {[
                ["Gross profit", formatCurrency(metrics.grossProfit)],
                ["Net profit", formatCurrency(metrics.netProfit)],
                ["Gross margin", `${metrics.grossMargin.toFixed(1)}%`],
                ["Annualized revenue", formatCurrency(metrics.annualRevenue)],
              ].map(([label, value]) => (
                <div key={label} className="panel-muted p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </Surface>

            <Surface className="space-y-3">
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Operator advice</div>
              <p className="text-sm leading-7 text-muted-foreground">
                Use the margin and profit output to decide whether you need better pricing, lower cost of delivery, or tighter operating discipline before scaling.
              </p>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default FinancialCalculator;
