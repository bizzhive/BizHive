import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  assertAdminPassword,
  corsHeaders,
  createServiceRoleClient,
  jsonResponse,
  loadBeeAdminSettings,
  loadLatestHealthChecks,
  normalizeRoutingConfig,
  saveBeeAdminSettings,
  smokeTestBeeProviders,
} from "../_shared/bee-runtime.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const password =
      typeof payload?.password === "string"
        ? payload.password
        : typeof payload?.adminPassword === "string"
          ? payload.adminPassword
          : "";

    assertAdminPassword(password);

    const action = typeof payload?.action === "string" ? payload.action : "getState";
    const supabase = createServiceRoleClient();

    if (action === "saveSettings") {
      const saved = await saveBeeAdminSettings(
        {
          adminPrompt:
            typeof payload?.adminPrompt === "string" ? payload.adminPrompt : "",
          guardrails:
            typeof payload?.guardrails === "string" ? payload.guardrails : "",
          routing: normalizeRoutingConfig(payload?.routing),
        },
        supabase
      );

      const healthChecks = await loadLatestHealthChecks(supabase);
      return jsonResponse({
        ok: true,
        settings: saved,
        healthChecks,
      });
    }

    if (action === "smokeTest") {
      const results = await smokeTestBeeProviders(supabase);
      const settings = await loadBeeAdminSettings(supabase);
      const healthChecks = await loadLatestHealthChecks(supabase);

      return jsonResponse({
        ok: true,
        results,
        settings,
        healthChecks,
      });
    }

    const settings = await loadBeeAdminSettings(supabase);
    const healthChecks = await loadLatestHealthChecks(supabase);

    return jsonResponse({
      ok: true,
      settings,
      healthChecks,
    });
  } catch (error) {
    console.error("Error in bee-admin function:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      error instanceof Error && /Incorrect admin password/i.test(error.message) ? 401 : 500
    );
  }
});
