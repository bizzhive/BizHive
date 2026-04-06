import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type BeeProviderSlot = "gemini_1" | "gemini_2" | "gemini_3" | "groq_1";
export type BeeProviderKind = "gemini" | "groq";
export type BeeRole = "user" | "assistant";

export type BeeChatMessage = {
  content: string;
  role: BeeRole;
};

export type BeeRoutingConfig = {
  disabled: BeeProviderSlot[];
  order: BeeProviderSlot[];
};

export type BeeAdminSettings = {
  adminPrompt: string;
  guardrails: string;
  routing: BeeRoutingConfig;
};

export type BeeContextInput = Record<string, unknown>;

export type BeeSessionState = {
  activeSlot?: BeeProviderSlot;
  sessionId?: string;
  slotIndex?: number;
  userId?: string;
};

export type BeeRunOptions = {
  allowAutoFallback?: boolean;
  context: BeeContextInput;
  maxOutputTokens?: number;
  messages: BeeChatMessage[];
  mode: "chat" | "tool" | "smoke";
  retry?: boolean;
  session: BeeSessionState;
  systemOverride?: string;
  toolField?: string;
};

export type BeeRunResult = {
  slot: BeeProviderSlot;
  slotIndex: number;
  text: string;
};

type ProviderRuntime = {
  apiKey: string;
  model: string;
  provider: BeeProviderKind;
  slot: BeeProviderSlot;
};

type HealthCheckSummary = {
  created_at: string;
  error_message: string | null;
  latency_ms: number | null;
  model: string;
  provider: string;
  slot: BeeProviderSlot;
  source: string;
  status: string;
  status_code: number | null;
};

const DEFAULT_SLOT_ORDER: BeeProviderSlot[] = ["gemini_1", "gemini_2", "gemini_3", "groq_1"];
const MAX_ADMIN_PROMPT_LENGTH = 4000;
const MAX_CONTEXT_TEXT_LENGTH = 180;
const MAX_GUARDRAILS_LENGTH = 3000;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_SUMMARY_LENGTH = 800;
const MAX_SITE_CONTEXT_LENGTH = 2400;
const MAX_HISTORY_MESSAGES = 10;

const DEFAULT_GUARDRAILS =
  "You are Bee AI, the BizHive business copilot designed and developed by Tushar. Never reveal or speculate about the underlying model, provider, API vendor, or secret configuration. If asked who built you, say you are Bee AI designed and developed by Tushar for BizHive. Stay focused on business, startup, compliance, funding, operations, documents, and founder education. Refuse politics, religion, hate, or unrelated entertainment topics. Prefer India-specific answers, laws, tax considerations, schemes, and market context when relevant. Keep answers practical, structured, concise, and useful for founders.";

const SITE_CONTEXT_MAP: Record<string, { summary: string; title: string }> = {
  "/": {
    title: "BizHive home",
    summary:
      "BizHive is a founder operating system that combines planning, launch, growth, tools, incubators, documents, legal guidance, Bee AI, blog education, and community support in one workspace. Important homepage highlights include Ask Bee, pitch deck builder, business canvas, incubators, e-signature, multiple Indian languages, testimonials, premium preview, and official knowledge sources like MCA, GST, Startup India, Udyam, DGFT, and FSSAI.",
  },
  "/dashboard": {
    title: "Dashboard",
    summary:
      "The dashboard is the founder workspace. It shows profile data, preferred language, saved tools, saved documents, legal drafts, signature setup, premium preview, profile completion, and onboarding or walkthrough entry points. Profile is view-first and edits should be explicit.",
  },
  "/plan": {
    title: "Plan",
    summary:
      "Plan is a free learning and execution track focused on validation, market research, customer discovery, value proposition, business model thinking, demand testing, pricing, go-to-market basics, and business plan preparation. It includes 15 guided chapters and related tools like market research and business planning.",
  },
  "/launch": {
    title: "Launch",
    summary:
      "Launch is a free learning and action track focused on registrations, taxation, legal documents, e-signature, onboarding, launch readiness, payments, operations checklists, go-live content, and launch-week control. It includes 15 guided chapters and launch workflows.",
  },
  "/manage": {
    title: "Grow",
    summary:
      "Grow is the ongoing operations and scaling track focused on revenue rhythm, founder scorecards, pricing, team systems, fundraising preparation, retention, distribution, channel growth, and execution management. It also includes 15 guided chapters and operating tools.",
  },
  "/tools": {
    title: "Tools",
    summary:
      "BizHive tools include business canvas, SWOT analysis, startup calculator, financial calculator, pitch deck builder, market research, business planning, and structured AI assist for text fields. Tools should save and reopen cleanly and Bee can help refine tool sections.",
  },
  "/incubators": {
    title: "Incubators",
    summary:
      "The incubators area helps founders explore incubators, accelerators, grants, funding routes, pitch preparation, and startup-support opportunities. Answers here should stay focused on practical shortlisting, readiness, documents, and fit for Indian founders.",
  },
  "/documents": {
    title: "Library",
    summary:
      "The library contains public documents, saved founder drafts, compliance resources, and official guidance references. Users can open, save, and revisit documents from the dashboard and library.",
  },
  "/legal": {
    title: "Legal studio",
    summary:
      "Legal Studio helps founders work with legal templates, editable drafts, signatures, document fields, and compliance support. It is guidance-oriented and should avoid pretending to be attorney-reviewed bespoke legal advice.",
  },
  "/community": {
    title: "Community",
    summary:
      "Community is a threaded founder discussion space with rooms, topics, replies, unread states, and private-channel previews. Bee can explain the community structure but should not rewrite or interfere with authored community conversations unless the user explicitly asks for help.",
  },
  "/blog": {
    title: "Blog",
    summary:
      "The blog contains published founder education on pricing, GST, customer interviews, founder scorecards, fundraising data rooms, launch readiness, hiring, compliance calendars, and growth systems. Bee can summarize blog topics but should not claim blog content is translated or authored by Bee.",
  },
  "/ai-assistant": {
    title: "Bee AI",
    summary:
      "Bee AI has two surfaces: a fullscreen workspace from the nav and a bottom-right copilot panel. It supports history, route-aware context, prompt chips, retry after provider failure, and text-selection prompts like 'What is the meaning of \"xyz\"?'.",
  },
};

const siteContextCache = new Map<string, string>();
const systemPromptCache = new Map<string, string>();

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "x-bee-session-id, x-bee-slot-index",
};

export const jsonResponse = (
  body: Record<string, unknown>,
  status = 200,
  headers: Record<string, string> = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...headers },
  });

export const createSseResponse = (
  text: string,
  headers: Record<string, string> = {},
  metadata?: Record<string, unknown>
) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      if (text.trim()) {
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              bee: metadata,
              choices: [{ delta: { content: text } }],
            })}\n\n`
          )
        );
      }

      await writer.write(encoder.encode("data: [DONE]\n\n"));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      ...headers,
    },
  });
};

export class BeeProviderError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "BeeProviderError";
    this.statusCode = statusCode;
  }
}

const truncateText = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
};

const compactObjectFields = (value: unknown, keys: string[]) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = keys
    .map((key) => [key, (value as Record<string, unknown>)[key]] as const)
    .filter(([, entryValue]) => {
      if (entryValue === null || entryValue === undefined) {
        return false;
      }

      if (typeof entryValue === "string") {
        return entryValue.trim().length > 0;
      }

      return true;
    })
    .map(([key, entryValue]) => [
      key,
      typeof entryValue === "string" ? truncateText(entryValue, MAX_CONTEXT_TEXT_LENGTH) : entryValue,
    ]);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const compactBeeContext = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const context = value as Record<string, unknown>;
  const businesses = Array.isArray(context.businesses)
    ? context.businesses
        .slice(0, 3)
        .map((business) =>
          compactObjectFields(business, [
            "name",
            "industry",
            "stage",
            "structure",
            "city",
            "state",
            "target_market",
          ])
        )
        .filter(Boolean)
    : [];

  return Object.fromEntries(
    [
      [
        "profile",
        compactObjectFields(context.profile, [
          "full_name",
          "industry",
          "state",
          "business_stage",
          "location_data",
          "preferred_language",
          "onboarding_completed",
        ]),
      ],
      ["businesses", businesses.length > 0 ? businesses : undefined],
      ["language", typeof context.language === "string" ? truncateText(context.language, 16) : undefined],
      ["currentPage", typeof context.currentPage === "string" ? truncateText(context.currentPage, 80) : undefined],
      ["pageTitle", typeof context.pageTitle === "string" ? truncateText(context.pageTitle, 120) : undefined],
      ["pageSection", typeof context.pageSection === "string" ? truncateText(context.pageSection, 120) : undefined],
      ["selectedText", typeof context.selectedText === "string" ? truncateText(context.selectedText, 220) : undefined],
      [
        "conversationSummary",
        typeof context.conversationSummary === "string"
          ? truncateText(context.conversationSummary, MAX_SUMMARY_LENGTH)
          : undefined,
      ],
      [
        "savedToolsCount",
        Array.isArray(context.saved_tools)
          ? context.saved_tools.length
          : typeof context.savedToolsCount === "number"
            ? context.savedToolsCount
            : undefined,
      ],
    ].filter(([, entryValue]) => entryValue !== undefined)
  );
};

const normalizeRole = (role: string): BeeRole => (role === "assistant" ? "assistant" : "user");

export const sanitizeMessages = (messages: BeeChatMessage[]) => {
  const cleaned = messages
    .map((message) => ({
      role: normalizeRole(message.role),
      content: truncateText(message.content, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0);

  const firstUserIndex = cleaned.findIndex((message) => message.role === "user");
  const relevantMessages =
    firstUserIndex === -1 ? [] : cleaned.slice(firstUserIndex).slice(-MAX_HISTORY_MESSAGES);

  return relevantMessages.reduce<BeeChatMessage[]>((accumulator, message) => {
    const lastMessage = accumulator[accumulator.length - 1];

    if (lastMessage?.role === message.role) {
      lastMessage.content = `${lastMessage.content}\n\n${message.content}`;
      return accumulator;
    }

    accumulator.push({ ...message });
    return accumulator;
  }, []);
};

const toGeminiMessages = (messages: BeeChatMessage[]) =>
  messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

const extractGeminiText = (payload: any) =>
  payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part?.text ?? "")
    .join("")
    .trim() ?? "";

const extractGroqText = (payload: any) =>
  payload?.choices?.[0]?.message?.content?.trim?.() ?? "";

const defaultRoutingConfig = (): BeeRoutingConfig => ({
  disabled: [],
  order: [...DEFAULT_SLOT_ORDER],
});

export const normalizeRoutingConfig = (value: unknown): BeeRoutingConfig => {
  if (!value) {
    return defaultRoutingConfig();
  }

  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return defaultRoutingConfig();
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return defaultRoutingConfig();
  }

  const order = Array.isArray((parsed as Record<string, unknown>).order)
    ? ((parsed as Record<string, unknown>).order as unknown[]).filter(
        (item): item is BeeProviderSlot =>
          typeof item === "string" && DEFAULT_SLOT_ORDER.includes(item as BeeProviderSlot)
      )
    : [];

  const disabled = Array.isArray((parsed as Record<string, unknown>).disabled)
    ? ((parsed as Record<string, unknown>).disabled as unknown[]).filter(
        (item): item is BeeProviderSlot =>
          typeof item === "string" && DEFAULT_SLOT_ORDER.includes(item as BeeProviderSlot)
      )
    : [];

  return {
    disabled: [...new Set(disabled)] as BeeProviderSlot[],
    order: [...new Set([...order, ...DEFAULT_SLOT_ORDER])] as BeeProviderSlot[],
  };
};

export const createServiceRoleClient = () => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error("Supabase service role configuration is missing.");
  }

  return createClient(url, key);
};

export const getRequestUser = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

  if (!authHeader || !url || !anonKey) {
    return null;
  }

  try {
    const client = createClient(url, anonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });
    const { data } = await client.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
};

export const assertAdminPassword = (password: string) => {
  const expectedPassword = Deno.env.get("ADMIN_ACCESS_PASSWORD");

  if (!expectedPassword) {
    throw new Error("ADMIN_ACCESS_PASSWORD is not configured.");
  }

  if (password !== expectedPassword) {
    throw new Error("Incorrect admin password.");
  }
};

export const loadBeeAdminSettings = async (
  supabase = createServiceRoleClient()
): Promise<BeeAdminSettings> => {
  const { data } = await supabase
    .from("admin_settings")
    .select("key, value")
    .in("key", ["ai_system_prompt", "bee_provider_routing", "bee_guardrails"]);

  const settingMap = new Map<string, string>();
  (data ?? []).forEach((row) => {
    if (typeof row.key === "string" && typeof row.value === "string") {
      settingMap.set(row.key, row.value);
    }
  });

  return {
    adminPrompt: truncateText(settingMap.get("ai_system_prompt") ?? "", MAX_ADMIN_PROMPT_LENGTH),
    guardrails: truncateText(settingMap.get("bee_guardrails") ?? DEFAULT_GUARDRAILS, MAX_GUARDRAILS_LENGTH),
    routing: normalizeRoutingConfig(settingMap.get("bee_provider_routing") ?? defaultRoutingConfig()),
  };
};

const getProviderCatalog = () => {
  const geminiModel = Deno.env.get("GEMINI_MODEL")?.trim() || "gemini-2.5-flash";
  const groqModel = Deno.env.get("GROQ_MODEL")?.trim() || "llama-3.3-70b-versatile";

  const catalog: Record<BeeProviderSlot, ProviderRuntime | null> = {
    gemini_1: Deno.env.get("GEMINI_API_KEY_1")
      ? {
          slot: "gemini_1",
          provider: "gemini",
          model: geminiModel,
          apiKey: Deno.env.get("GEMINI_API_KEY_1")!,
        }
      : null,
    gemini_2: Deno.env.get("GEMINI_API_KEY_2")
      ? {
          slot: "gemini_2",
          provider: "gemini",
          model: geminiModel,
          apiKey: Deno.env.get("GEMINI_API_KEY_2")!,
        }
      : null,
    gemini_3: Deno.env.get("GEMINI_API_KEY_3")
      ? {
          slot: "gemini_3",
          provider: "gemini",
          model: geminiModel,
          apiKey: Deno.env.get("GEMINI_API_KEY_3")!,
        }
      : null,
    groq_1: Deno.env.get("GROQ_API_KEY_1")
      ? {
          slot: "groq_1",
          provider: "groq",
          model: groqModel,
          apiKey: Deno.env.get("GROQ_API_KEY_1")!,
        }
      : null,
  };

  return catalog;
};

const getEnabledProviders = (routing: BeeRoutingConfig) => {
  const catalog = getProviderCatalog();
  const disabledSet = new Set(routing.disabled);

  return routing.order
    .filter((slot, index, array) => array.indexOf(slot) === index)
    .map((slot) => catalog[slot])
    .filter((item): item is ProviderRuntime => Boolean(item) && !disabledSet.has(item.slot));
};

const getRouteKey = (context: BeeContextInput) =>
  typeof context.currentPage === "string"
    ? context.currentPage
    : typeof context.page === "string"
      ? context.page
      : "/";

const getLatestUserPrompt = (messages: BeeChatMessage[]) =>
  [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

const getSiteContextText = (context: BeeContextInput, latestUserPrompt: string) => {
  const routeKey = getRouteKey(context);
  const keywordSeed = latestUserPrompt.toLowerCase();
  const cacheKey = `${routeKey}::${keywordSeed.slice(0, 120)}`;
  const cached = siteContextCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const chunks: string[] = [];
  const routeContext = SITE_CONTEXT_MAP[routeKey];
  if (routeContext) {
    chunks.push(`${routeContext.title}: ${routeContext.summary}`);
  }

  chunks.push(SITE_CONTEXT_MAP["/"].summary);

  if (/(incubator|accelerator|grant|fund|pitch)/i.test(keywordSeed)) {
    chunks.push(SITE_CONTEXT_MAP["/incubators"].summary);
  }

  if (/(gst|tax|compliance|registration|mca|fssai|udyam|iec|legal)/i.test(keywordSeed)) {
    chunks.push(
      "Official knowledge sources available in BizHive include MCA, GST Portal, Startup India, Udyam Registration, DGFT, and FSSAI FoSCoS. Prefer official Indian government or regulator guidance when discussing compliance."
    );
  }

  if (/(blog|article|founder scorecard|pricing|customer interview|runway|data room)/i.test(keywordSeed)) {
    chunks.push(SITE_CONTEXT_MAP["/blog"].summary);
  }

  if (/(tool|canvas|swot|calculator|deck|business plan)/i.test(keywordSeed)) {
    chunks.push(SITE_CONTEXT_MAP["/tools"].summary);
  }

  const result = truncateText([...new Set(chunks)].join("\n\n"), MAX_SITE_CONTEXT_LENGTH);
  siteContextCache.set(cacheKey, result);
  return result;
};

const buildLanguageInstruction = (context: BeeContextInput) => {
  const language = typeof context.language === "string" ? context.language.trim().toLowerCase() : "en";

  if (!language || language === "en") {
    return "";
  }

  return `Respond in the language with code "${language}" unless the user explicitly asks for another language.`;
};

const buildSystemPrompt = (
  settings: BeeAdminSettings,
  context: BeeContextInput,
  latestUserPrompt: string,
  systemOverride?: string,
  toolField?: string
) => {
  const compactContext = compactBeeContext(context);
  const siteContext = getSiteContextText(context, latestUserPrompt);
  const languageInstruction = buildLanguageInstruction(context);
  const overrideText =
    typeof systemOverride === "string" && systemOverride.trim()
      ? truncateText(systemOverride, MAX_ADMIN_PROMPT_LENGTH)
      : "";

  const cacheKey = JSON.stringify({
    adminPrompt: settings.adminPrompt,
    guardrails: settings.guardrails,
    languageInstruction,
    overrideText,
    siteContext,
    toolField: toolField ?? "",
    compactContext,
  });

  const cached = systemPromptCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = [
    settings.guardrails || DEFAULT_GUARDRAILS,
    settings.adminPrompt ? `BizHive admin instruction:\n${settings.adminPrompt}` : "",
    overrideText ? `Run-specific override:\n${overrideText}` : "",
    toolField ? `Current task: help the founder specifically with the "${toolField}" field or decision area.` : "",
    languageInstruction,
    `User and page context:\n${JSON.stringify(compactContext, null, 2)}`,
    `BizHive site context:\n${siteContext}`,
    "Answer style: practical, India-aware, founder-friendly, and action-oriented. Prefer structured bullets or short sections when useful. If a request is unrelated to business, politely redirect back to business, startup, compliance, funding, tools, documents, or learning topics.",
  ]
    .filter(Boolean)
    .join("\n\n");

  systemPromptCache.set(cacheKey, prompt);
  return prompt;
};

const callGemini = async (
  provider: ProviderRuntime,
  systemPrompt: string,
  messages: BeeChatMessage[],
  maxOutputTokens: number
) => {
  const start = Date.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: toGeminiMessages(messages),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens,
        },
      }),
    }
  );

  const latencyMs = Date.now() - start;

  if (!response.ok) {
    throw new BeeProviderError(await response.text(), response.status);
  }

  const payload = await response.json();
  const text = extractGeminiText(payload);

  if (!text) {
    throw new BeeProviderError("Bee could not generate a response.", 502);
  }

  return { latencyMs, text };
};

const callGroq = async (
  provider: ProviderRuntime,
  systemPrompt: string,
  messages: BeeChatMessage[],
  maxOutputTokens: number
) => {
  const start = Date.now();
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      stream: false,
      temperature: 0.4,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  });

  const latencyMs = Date.now() - start;

  if (!response.ok) {
    throw new BeeProviderError(await response.text(), response.status);
  }

  const payload = await response.json();
  const text = extractGroqText(payload);

  if (!text) {
    throw new BeeProviderError("Bee could not generate a response.", 502);
  }

  return { latencyMs, text };
};

const recordHealthCheck = async (
  supabase: ReturnType<typeof createServiceRoleClient>,
  input: {
    errorMessage?: string | null;
    latencyMs?: number | null;
    model: string;
    provider: BeeProviderKind;
    slot: BeeProviderSlot;
    source: string;
    status: string;
    statusCode?: number | null;
  }
) => {
  try {
    await supabase.from("bee_provider_health_checks").insert({
      slot: input.slot,
      provider: input.provider,
      model: input.model,
      source: input.source,
      status: input.status,
      status_code: input.statusCode ?? null,
      latency_ms: input.latencyMs ?? null,
      error_message: input.errorMessage ?? null,
    });
  } catch {
    // Health logging should never break the chat path.
  }
};

const getSlotFromIndex = (enabledProviders: ProviderRuntime[], slotIndex?: number) => {
  if (typeof slotIndex !== "number") {
    return undefined;
  }

  return enabledProviders[slotIndex];
};

const getSlotIndex = (enabledProviders: ProviderRuntime[], slot?: BeeProviderSlot) =>
  enabledProviders.findIndex((provider) => provider.slot === slot);

const getNextProvider = (
  enabledProviders: ProviderRuntime[],
  currentSlot?: BeeProviderSlot
) => {
  if (!enabledProviders.length) {
    return undefined;
  }

  if (!currentSlot) {
    return enabledProviders[0];
  }

  const currentIndex = enabledProviders.findIndex((provider) => provider.slot === currentSlot);

  if (currentIndex === -1) {
    return enabledProviders[0];
  }

  return enabledProviders[currentIndex + 1];
};

const getChatSessionRecord = async (
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  sessionId?: string
) => {
  if (!sessionId) {
    return null;
  }

  const { data } = await supabase
    .from("chat_sessions")
    .select("id, active_provider_slot")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  return data ?? null;
};

const resolveProvider = async (
  supabase: ReturnType<typeof createServiceRoleClient>,
  settings: BeeAdminSettings,
  session: BeeSessionState,
  retry: boolean
) => {
  const enabledProviders = getEnabledProviders(settings.routing);

  if (!enabledProviders.length) {
    throw new Error("Bee AI is not configured with any enabled provider slots.");
  }

  let currentSlot = session.activeSlot;

  if (!currentSlot && session.userId && session.sessionId) {
    const currentSession = await getChatSessionRecord(supabase, session.userId, session.sessionId);
    if (currentSession?.active_provider_slot) {
      currentSlot = currentSession.active_provider_slot as BeeProviderSlot;
    }
  }

  const hintedProvider =
    !currentSlot && typeof session.slotIndex === "number"
      ? getSlotFromIndex(enabledProviders, session.slotIndex)
      : undefined;

  const activeProvider = retry
    ? getNextProvider(enabledProviders, currentSlot ?? hintedProvider?.slot)
    : currentSlot
      ? enabledProviders.find((provider) => provider.slot === currentSlot)
      : hintedProvider ?? enabledProviders[0];

  if (!activeProvider) {
    throw new Error("Bee AI has no more enabled provider slots available for retry.");
  }

  return {
    activeProvider,
    enabledProviders,
  };
};

const runProvider = async (
  provider: ProviderRuntime,
  systemPrompt: string,
  messages: BeeChatMessage[],
  maxOutputTokens: number
) => {
  if (provider.provider === "groq") {
    return callGroq(provider, systemPrompt, messages, maxOutputTokens);
  }

  return callGemini(provider, systemPrompt, messages, maxOutputTokens);
};

export const runBeePrompt = async (
  options: BeeRunOptions,
  supabase = createServiceRoleClient()
): Promise<BeeRunResult> => {
  const settings = await loadBeeAdminSettings(supabase);
  const sanitizedMessages = sanitizeMessages(options.messages);

  if (!sanitizedMessages.length) {
    throw new Error("Bee needs at least one user message.");
  }

  const latestUserPrompt = getLatestUserPrompt(sanitizedMessages);
  if (!latestUserPrompt) {
    throw new Error("Bee needs a user message to continue.");
  }

  const systemPrompt = buildSystemPrompt(
    settings,
    options.context,
    latestUserPrompt,
    options.systemOverride,
    options.toolField
  );
  const maxOutputTokens = options.maxOutputTokens ?? (options.mode === "tool" ? 320 : 640);

  const { activeProvider, enabledProviders } = await resolveProvider(
    supabase,
    settings,
    options.session,
    Boolean(options.retry)
  );

  const providerQueue =
    options.allowAutoFallback === true
      ? [activeProvider, ...enabledProviders.filter((provider) => provider.slot !== activeProvider.slot)]
      : [activeProvider];

  let lastError: BeeProviderError | null = null;

  for (const provider of providerQueue) {
    try {
      const result = await runProvider(provider, systemPrompt, sanitizedMessages, maxOutputTokens);

      await recordHealthCheck(supabase, {
        slot: provider.slot,
        provider: provider.provider,
        model: provider.model,
        source: options.mode === "smoke" ? "smoke_test" : `runtime_${options.mode}`,
        status: "success",
        latencyMs: result.latencyMs,
      });

      return {
        slot: provider.slot,
        slotIndex: getSlotIndex(enabledProviders, provider.slot),
        text: result.text,
      };
    } catch (error) {
      lastError =
        error instanceof BeeProviderError
          ? error
          : new BeeProviderError(error instanceof Error ? error.message : "Unknown provider error");

      await recordHealthCheck(supabase, {
        slot: provider.slot,
        provider: provider.provider,
        model: provider.model,
        source: options.mode === "smoke" ? "smoke_test" : `runtime_${options.mode}`,
        status: "error",
        statusCode: lastError.statusCode ?? null,
        errorMessage: truncateText(lastError.message, 400),
      });

      if (options.allowAutoFallback !== true) {
        break;
      }
    }
  }

  throw lastError ?? new BeeProviderError("Bee AI could not complete the request.");
};

const buildSessionSummary = (messages: BeeChatMessage[], assistantText: string) => {
  const recentUserTurns = messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => truncateText(message.content, 120));

  return truncateText(
    [...recentUserTurns, truncateText(assistantText, 180)].filter(Boolean).join(" | "),
    MAX_SUMMARY_LENGTH
  );
};

export const persistChatSuccess = async (
  supabase: ReturnType<typeof createServiceRoleClient>,
  input: {
    assistantText: string;
    context: BeeContextInput;
    messages: BeeChatMessage[];
    sessionId?: string;
    slot: BeeProviderSlot;
    slotIndex: number;
    userId?: string;
  }
) => {
  if (!input.userId || !input.sessionId) {
    return;
  }

  const latestUserMessage = [...input.messages].reverse().find((message) => message.role === "user");
  if (!latestUserMessage) {
    return;
  }

  const currentPage = typeof input.context.currentPage === "string" ? input.context.currentPage : null;
  const pageTitle = typeof input.context.pageTitle === "string" ? input.context.pageTitle : null;
  const existingSession = await getChatSessionRecord(supabase, input.userId, input.sessionId);
  const sessionTitle = existingSession ? undefined : truncateText(latestUserMessage.content, 80);
  const summary = buildSessionSummary(input.messages, input.assistantText);

  await supabase.from("chat_sessions").upsert(
    {
      id: input.sessionId,
      user_id: input.userId,
      title: sessionTitle ?? "New chat",
      active_provider_slot: input.slot,
      last_context_route: currentPage,
      last_context_title: pageTitle,
      summary,
    },
    {
      onConflict: "id",
      ignoreDuplicates: false,
    }
  );

  if (sessionTitle === undefined) {
    await supabase
      .from("chat_sessions")
      .update({
        active_provider_slot: input.slot,
        last_context_route: currentPage,
        last_context_title: pageTitle,
        summary,
      })
      .eq("id", input.sessionId)
      .eq("user_id", input.userId);
  }

  await supabase.from("chat_messages").insert([
    {
      user_id: input.userId,
      session_id: input.sessionId,
      role: "user",
      content: latestUserMessage.content,
      metadata: {
        pageTitle,
        route: currentPage,
        slotIndex: input.slotIndex,
      },
    },
    {
      user_id: input.userId,
      session_id: input.sessionId,
      role: "assistant",
      content: input.assistantText,
      metadata: {
        pageTitle,
        route: currentPage,
        slotIndex: input.slotIndex,
      },
    },
  ]);
};

export const loadLatestHealthChecks = async (
  supabase = createServiceRoleClient()
): Promise<HealthCheckSummary[]> => {
  const { data } = await supabase
    .from("bee_provider_health_checks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);

  const seen = new Set<string>();
  const latest: HealthCheckSummary[] = [];

  for (const row of data ?? []) {
    const slot = row.slot as BeeProviderSlot;
    if (seen.has(slot)) {
      continue;
    }

    seen.add(slot);
    latest.push({
      created_at: row.created_at,
      error_message: row.error_message,
      latency_ms: row.latency_ms,
      model: row.model,
      provider: row.provider,
      slot,
      source: row.source,
      status: row.status,
      status_code: row.status_code,
    });
  }

  return latest.sort(
    (left, right) =>
      DEFAULT_SLOT_ORDER.indexOf(left.slot) - DEFAULT_SLOT_ORDER.indexOf(right.slot)
  );
};

export const saveBeeAdminSettings = async (
  input: {
    adminPrompt: string;
    guardrails: string;
    routing: BeeRoutingConfig;
  },
  supabase = createServiceRoleClient()
) => {
  const routing = normalizeRoutingConfig(input.routing);

  await supabase.from("admin_settings").upsert(
    [
      {
        key: "ai_system_prompt",
        value: truncateText(input.adminPrompt ?? "", MAX_ADMIN_PROMPT_LENGTH),
      },
      {
        key: "bee_guardrails",
        value: truncateText(input.guardrails ?? DEFAULT_GUARDRAILS, MAX_GUARDRAILS_LENGTH),
      },
      {
        key: "bee_provider_routing",
        value: JSON.stringify(routing),
      },
    ],
    {
      onConflict: "key",
      ignoreDuplicates: false,
    }
  );

  return {
    adminPrompt: truncateText(input.adminPrompt ?? "", MAX_ADMIN_PROMPT_LENGTH),
    guardrails: truncateText(input.guardrails ?? DEFAULT_GUARDRAILS, MAX_GUARDRAILS_LENGTH),
    routing,
  };
};

export const smokeTestBeeProviders = async (supabase = createServiceRoleClient()) => {
  const settings = await loadBeeAdminSettings(supabase);
  const enabledProviders = getEnabledProviders(settings.routing);

  if (!enabledProviders.length) {
    throw new Error("No enabled Bee provider slots are configured.");
  }

  const results: Array<{ error?: string; latencyMs?: number; slot: BeeProviderSlot; status: "error" | "success" }> = [];

  for (const provider of enabledProviders) {
    try {
      const systemPrompt = buildSystemPrompt(
        settings,
        { currentPage: "/ai-assistant", pageTitle: "Bee AI smoke test" },
        "Reply with the word BEE_OK.",
        ""
      );

      const result = await runProvider(
        provider,
        systemPrompt,
        [{ role: "user", content: "Reply with the single token BEE_OK." }],
        48
      );

      await recordHealthCheck(supabase, {
        slot: provider.slot,
        provider: provider.provider,
        model: provider.model,
        source: "smoke_test",
        status: "success",
        latencyMs: result.latencyMs,
      });

      results.push({
        slot: provider.slot,
        status: "success",
        latencyMs: result.latencyMs,
      });
    } catch (error) {
      const providerError =
        error instanceof BeeProviderError
          ? error
          : new BeeProviderError(error instanceof Error ? error.message : "Unknown provider error");

      await recordHealthCheck(supabase, {
        slot: provider.slot,
        provider: provider.provider,
        model: provider.model,
        source: "smoke_test",
        status: "error",
        statusCode: providerError.statusCode ?? null,
        errorMessage: truncateText(providerError.message, 300),
      });

      results.push({
        slot: provider.slot,
        status: "error",
        error: truncateText(providerError.message, 300),
      });
    }
  }

  return results;
};
