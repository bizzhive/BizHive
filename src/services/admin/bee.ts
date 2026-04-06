import {
  createSupabaseFunctionHeaders,
  getSupabaseFunctionUrl,
} from "@/services/supabase/client";
import { getTemporaryAdminPassword } from "@/services/admin/access";

export type BeeProviderRouting = {
  disabled: string[];
  order: string[];
};

export type BeeProviderHealthCheck = {
  created_at: string;
  error_message: string | null;
  latency_ms: number | null;
  model: string;
  provider: string;
  slot: string;
  source: string;
  status: string;
  status_code: number | null;
};

export type BeeAdminState = {
  healthChecks: BeeProviderHealthCheck[];
  settings: {
    adminPrompt: string;
    guardrails: string;
    routing: BeeProviderRouting;
  };
};

const callBeeAdmin = async (body: Record<string, unknown>) => {
  const password = getTemporaryAdminPassword();

  if (!password) {
    throw new Error("Unlock admin access first.");
  }

  const response = await fetch(getSupabaseFunctionUrl("bee-admin"), {
    method: "POST",
    headers: createSupabaseFunctionHeaders(),
    body: JSON.stringify({
      ...body,
      password,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    healthChecks?: BeeProviderHealthCheck[];
    ok?: boolean;
    results?: Array<{
      error?: string;
      latencyMs?: number;
      slot: string;
      status: "error" | "success";
    }>;
    settings?: BeeAdminState["settings"];
  };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Bee admin request failed.");
  }

  return payload;
};

export const fetchBeeAdminState = async (): Promise<BeeAdminState> => {
  const payload = await callBeeAdmin({ action: "getState" });

  return {
    healthChecks: payload.healthChecks ?? [],
    settings: payload.settings ?? {
      adminPrompt: "",
      guardrails: "",
      routing: { disabled: [], order: [] },
    },
  };
};

export const saveBeeAdminState = async (input: BeeAdminState["settings"]) => {
  const payload = await callBeeAdmin({
    action: "saveSettings",
    adminPrompt: input.adminPrompt,
    guardrails: input.guardrails,
    routing: input.routing,
  });

  return {
    healthChecks: payload.healthChecks ?? [],
    settings: payload.settings ?? input,
  };
};

export const runBeeSmokeTest = async () => {
  const payload = await callBeeAdmin({ action: "smokeTest" });

  return {
    healthChecks: payload.healthChecks ?? [],
    results: payload.results ?? [],
    settings: payload.settings,
  };
};
