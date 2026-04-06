import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Bot, Loader2, Save, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Surface } from "@/components/site/SitePrimitives";
import {
  fetchBeeAdminState,
  runBeeSmokeTest,
  saveBeeAdminState,
  type BeeAdminState,
  type BeeProviderHealthCheck,
} from "@/services/admin/bee";

const SLOT_LABELS: Record<string, string> = {
  gemini_1: "Gemini slot 1",
  gemini_2: "Gemini slot 2",
  gemini_3: "Gemini slot 3",
  groq_1: "Groq slot 1",
};

const moveItem = (items: string[], slot: string, direction: "up" | "down") => {
  const index = items.indexOf(slot);
  if (index === -1) {
    return items;
  }

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
  return nextItems;
};

const formatLatency = (latency?: number | null) =>
  typeof latency === "number" && Number.isFinite(latency) ? `${latency} ms` : "No data";

const AdminBeeTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [smokeRunning, setSmokeRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<BeeAdminState>({
    healthChecks: [],
    settings: {
      adminPrompt: "",
      guardrails: "",
      routing: {
        disabled: [],
        order: ["gemini_1", "gemini_2", "gemini_3", "groq_1"],
      },
    },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        setState(await fetchBeeAdminState());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load Bee admin state.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const healthBySlot = useMemo(() => {
    const map = new Map<string, BeeProviderHealthCheck>();
    state.healthChecks.forEach((item) => {
      map.set(item.slot, item);
    });
    return map;
  }, [state.healthChecks]);

  const toggleDisabled = (slot: string) => {
    setState((current) => {
      const disabled = current.settings.routing.disabled.includes(slot)
        ? current.settings.routing.disabled.filter((item) => item !== slot)
        : [...current.settings.routing.disabled, slot];

      return {
        ...current,
        settings: {
          ...current.settings,
          routing: {
            ...current.settings.routing,
            disabled,
          },
        },
      };
    });
  };

  const saveSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      const nextState = await saveBeeAdminState(state.settings);
      setState(nextState);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save Bee settings.");
    } finally {
      setSaving(false);
    }
  };

  const smokeTest = async () => {
    setSmokeRunning(true);
    setError(null);

    try {
      const result = await runBeeSmokeTest();
      setState((current) => ({
        healthChecks: result.healthChecks,
        settings: result.settings ?? current.settings,
      }));
    } catch (smokeError) {
      setError(smokeError instanceof Error ? smokeError.message : "Failed to run Bee smoke test.");
    } finally {
      setSmokeRunning(false);
    }
  };

  if (loading) {
    return <Surface>Loading Bee controls...</Surface>;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Bot className="h-4 w-4 text-primary" />
            Bee instruction wrapper
          </div>
          <Textarea
            value={state.settings.adminPrompt}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                settings: { ...current.settings, adminPrompt: event.target.value },
              }))
            }
            placeholder="Add BizHive-specific instruction layers that should sit on top of Bee's default business guardrails."
            className="min-h-[220px] rounded-[24px]"
          />
          <Textarea
            value={state.settings.guardrails}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                settings: { ...current.settings, guardrails: event.target.value },
              }))
            }
            placeholder="Guardrails for identity, business-only behavior, India-specific bias, and provider secrecy."
            className="min-h-[180px] rounded-[24px]"
          />
          <div className="flex gap-3">
            <Button className="h-11 rounded-2xl" disabled={saving} onClick={() => void saveSettings()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Bee settings
            </Button>
            <Button variant="ghost" className="h-11 rounded-2xl" disabled={smokeRunning} onClick={() => void smokeTest()}>
              {smokeRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Stethoscope className="mr-2 h-4 w-4" />}
              Smoke test providers
            </Button>
          </div>
          {error ? <div className="rounded-[20px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
        </Surface>

        <Surface className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Provider order and availability
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Raw secrets stay in Supabase Edge Function secrets. This panel only controls Bee routing, enablement, and health visibility.
          </p>
          <div className="space-y-3">
            {state.settings.routing.order.map((slot, index, order) => {
              const health = healthBySlot.get(slot);
              const isDisabled = state.settings.routing.disabled.includes(slot);

              return (
                <div key={slot} className="rounded-[22px] border border-border/70 bg-muted/35 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-foreground">{SLOT_LABELS[slot] ?? slot}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {health ? `${health.status} · ${formatLatency(health.latency_ms)}` : "No health data yet"}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={!isDisabled}
                        onChange={() => toggleDisabled(slot)}
                        className="h-4 w-4 rounded border-border"
                      />
                      Enabled
                    </label>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-2xl"
                      disabled={index === 0}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          settings: {
                            ...current.settings,
                            routing: {
                              ...current.settings.routing,
                              order: moveItem(order, slot, "up"),
                            },
                          },
                        }))
                      }
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Up
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-2xl"
                      disabled={index === order.length - 1}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          settings: {
                            ...current.settings,
                            routing: {
                              ...current.settings.routing,
                              order: moveItem(order, slot, "down"),
                            },
                          },
                        }))
                      }
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Down
                    </Button>
                  </div>
                  {health?.error_message ? (
                    <div className="mt-3 rounded-[18px] border border-border/60 bg-background/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
                      {health.error_message}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Surface>
      </section>
    </div>
  );
};

export default AdminBeeTab;
