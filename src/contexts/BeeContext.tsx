import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/services/supabase/client";
import { BeeChatError, streamBizHiveChat, type ChatMessage } from "@/services/ai/chat";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/services/supabase/database.types";

type BeeMessageStatus = "error" | "ready" | "streaming";

export type BeeMessage = {
  content: string;
  createdAt: string;
  id: string;
  retryable?: boolean;
  role: "assistant" | "user";
  status: BeeMessageStatus;
};

export type BeeSession = {
  archivedAt?: string | null;
  id: string;
  messages: BeeMessage[];
  slotIndex?: number;
  summary: string;
  title: string;
  updatedAt: string;
};

type BeeRouteContext = {
  chip: string;
  description: string;
  title: string;
};

type BeeContextValue = {
  activeSessionId: string | null;
  archiveSession: (sessionId: string) => Promise<void>;
  closeCopilot: () => void;
  context: BeeRouteContext;
  copilotOpen: boolean;
  createNewChat: () => void;
  currentSession: BeeSession | null;
  draft: string;
  fullscreen: boolean;
  historyLoading: boolean;
  messages: BeeMessage[];
  openCopilot: (prefill?: string, selectedText?: string) => void;
  openFullscreen: (prefill?: string, selectedText?: string) => void;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  selectSession: (sessionId: string) => void;
  sendMessage: (value?: string) => Promise<void>;
  sessions: BeeSession[];
  setDraft: (value: string) => void;
  streaming: boolean;
};

type ProfileRow = Tables<"profiles">;
type BusinessRow = Tables<"businesses">;
type ChatSessionRow = {
  active_provider_slot: string;
  archived_at: string | null;
  created_at: string;
  id: string;
  last_context_route: string | null;
  last_context_title: string | null;
  summary: string;
  title: string;
  updated_at: string;
  user_id: string;
};

type ChatMessageRow = Tables<"chat_messages">;

const GUEST_SESSIONS_KEY = "bizhive.bee.guest.sessions";
const GUEST_ACTIVE_KEY = "bizhive.bee.guest.active";

const BEE_ROUTE_CONTEXT: Record<string, BeeRouteContext> = {
  "/": {
    chip: "Overview",
    description: "Ask Bee about product features, founder paths, official resources, or what to do next.",
    title: "Home",
  },
  "/ai-assistant": {
    chip: "Assistant",
    description: "This is the fullscreen Bee workspace for longer, route-aware founder help.",
    title: "Bee AI",
  },
  "/blog": {
    chip: "Reading",
    description: "Bee can summarize founder topics from published articles without changing authored blog content.",
    title: "Blog",
  },
  "/community": {
    chip: "Discussion",
    description: "Bee can explain community structure and startup concepts without interfering with authored member conversations.",
    title: "Community",
  },
  "/dashboard": {
    chip: "Workspace",
    description: "Bee can help with profile fields, signature setup, premium preview, and saved work.",
    title: "Dashboard",
  },
  "/documents": {
    chip: "Library",
    description: "Bee can help explain documents, templates, and what to open next.",
    title: "Library",
  },
  "/incubators": {
    chip: "Funding",
    description: "Bee can help shortlist incubators, grants, and pitch-prep actions for Indian founders.",
    title: "Incubators",
  },
  "/launch": {
    chip: "Execution",
    description: "Bee can help with launch readiness, registrations, legal prep, taxation, and go-live decisions.",
    title: "Launch",
  },
  "/legal": {
    chip: "Legal",
    description: "Bee can explain legal fields, signature reuse, and document workflow decisions.",
    title: "Legal Studio",
  },
  "/manage": {
    chip: "Operations",
    description: "Bee can help with growth, funding prep, metrics, retention, and founder operating rhythm.",
    title: "Grow",
  },
  "/plan": {
    chip: "Planning",
    description: "Bee can help with market research, business model clarity, validation, and planning decisions.",
    title: "Plan",
  },
  "/tools": {
    chip: "Builder",
    description: "Bee can help decide which tool to use and how to strengthen the current section.",
    title: "Tools",
  },
};

const BeeContext = createContext<BeeContextValue | undefined>(undefined);

const createBlankSession = (): BeeSession => ({
  id: crypto.randomUUID(),
  messages: [],
  slotIndex: 0,
  summary: "",
  title: "New chat",
  updatedAt: new Date().toISOString(),
});

const buildSessionTitle = (prompt: string) => {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return "New chat";
  }

  return trimmed.length > 60 ? `${trimmed.slice(0, 57).trimEnd()}...` : trimmed;
};

const buildConversationSummary = (messages: BeeMessage[]) =>
  messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join(" | ")
    .slice(0, 500);

const mapServerSession = (session: ChatSessionRow): BeeSession => ({
  archivedAt: session.archived_at,
  id: session.id,
  messages: [],
  summary: session.summary ?? "",
  title: session.title,
  updatedAt: session.updated_at,
});

const mapServerMessage = (message: ChatMessageRow): BeeMessage => ({
  content: message.content,
  createdAt: message.created_at,
  id: message.id,
  role: message.role === "assistant" ? "assistant" : "user",
  status: "ready",
});

const readGuestSessions = (): BeeSession[] => {
  if (typeof window === "undefined") {
    return [createBlankSession()];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(GUEST_SESSIONS_KEY) ?? "[]") as BeeSession[];
    return parsed.length
      ? parsed.map((session) => ({
          ...session,
          slotIndex: typeof session.slotIndex === "number" ? session.slotIndex : 0,
        }))
      : [createBlankSession()];
  } catch {
    return [createBlankSession()];
  }
};

const writeGuestSessions = (sessions: BeeSession[], activeSessionId: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));
  if (activeSessionId) {
    window.localStorage.setItem(GUEST_ACTIVE_KEY, activeSessionId);
  } else {
    window.localStorage.removeItem(GUEST_ACTIVE_KEY);
  }
};

const readGuestActiveSessionId = (sessions: BeeSession[]) => {
  if (typeof window === "undefined") {
    return sessions[0]?.id ?? null;
  }

  const stored = window.localStorage.getItem(GUEST_ACTIVE_KEY);
  return sessions.some((session) => session.id === stored) ? stored : sessions[0]?.id ?? null;
};

const extractSelectedTextFromPrompt = (prompt?: string) => {
  if (!prompt) {
    return null;
  }

  const match = prompt.match(/"(.+?)"/);
  return match?.[1] ?? null;
};

const buildProviderMessages = (messages: BeeMessage[]): ChatMessage[] =>
  messages
    .filter((message) => message.status !== "error")
    .map((message) => ({
      content: message.content,
      role: message.role,
    }));

const sortSessions = (items: BeeSession[]) =>
  [...items].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );

export const BeeProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { session, user } = useAuth();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessions, setSessions] = useState<BeeSession[]>(() => readGuestSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() =>
    readGuestActiveSessionId(readGuestSessions())
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [savedToolsCount, setSavedToolsCount] = useState(0);
  const selectedTextRef = useRef<string | null>(null);
  const hydratedSessionIdsRef = useRef<Set<string>>(new Set());

  const context = useMemo(() => {
    const exact = BEE_ROUTE_CONTEXT[location.pathname];
    if (exact) {
      return exact;
    }

    const matched = Object.entries(BEE_ROUTE_CONTEXT).find(([route]) =>
      route !== "/" && location.pathname.startsWith(`${route}/`)
    );

    return matched?.[1] ?? BEE_ROUTE_CONTEXT["/"];
  }, [location.pathname]);

  const currentSession = useMemo(
    () => sessions.find((item) => item.id === activeSessionId) ?? null,
    [activeSessionId, sessions]
  );

  const messages = currentSession?.messages ?? [];

  useEffect(() => {
    document.body.dataset.beeSurface = context.title;
  }, [context.title]);

  useEffect(() => {
    const loadProfileContext = async () => {
      if (!user) {
        setProfile(null);
        setBusinesses([]);
        setSavedToolsCount(0);
        return;
      }

      const [profileRes, businessesRes, savedToolsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("saved_tools").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setProfile(profileRes.data ?? null);
      setBusinesses(businessesRes.data ?? []);
      setSavedToolsCount(savedToolsRes.count ?? 0);
    };

    void loadProfileContext();
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      hydratedSessionIdsRef.current = new Set();
      const guestSessions = readGuestSessions();
      setSessions(guestSessions);
      setActiveSessionId(readGuestActiveSessionId(guestSessions));
      return;
    }

    const loadServerSessions = async () => {
      setHistoryLoading(true);

      const { data } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("archived_at", null)
        .order("updated_at", { ascending: false });

      const nextSessions = (data as ChatSessionRow[] | null)?.map(mapServerSession) ?? [];
      const hydratedSessions = nextSessions.length ? nextSessions : [createBlankSession()];
      hydratedSessionIdsRef.current = new Set();
      setSessions(hydratedSessions);
      setActiveSessionId((current) =>
        hydratedSessions.some((session) => session.id === current)
          ? current
          : hydratedSessions[0]?.id ?? null
      );
      setHistoryLoading(false);
    };

    void loadServerSessions();
  }, [user?.id]);

  useEffect(() => {
    if (!user || !activeSessionId) {
      return;
    }

    const activeSession = sessions.find((item) => item.id === activeSessionId);
    if (
      !activeSession ||
      activeSession.messages.length > 0 ||
      hydratedSessionIdsRef.current.has(activeSessionId)
    ) {
      return;
    }

    const loadMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeSessionId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      hydratedSessionIdsRef.current.add(activeSessionId);
      setSessions((current) =>
        current.map((session) =>
          session.id === activeSessionId
            ? { ...session, messages: (data ?? []).map(mapServerMessage) }
            : session
        )
      );
    };

    void loadMessages();
  }, [activeSessionId, sessions, user]);

  useEffect(() => {
    if (!user) {
      writeGuestSessions(sessions, activeSessionId);
    }
  }, [activeSessionId, sessions, user]);

  const updateSession = (sessionId: string, updater: (session: BeeSession) => BeeSession) => {
    setSessions((current) =>
      sortSessions(current.map((session) => (session.id === sessionId ? updater(session) : session)))
    );
  };

  const ensureActiveSession = () => {
    if (currentSession) {
      return currentSession;
    }

    const blankSession = createBlankSession();
    setSessions((current) => sortSessions([blankSession, ...current]));
    setActiveSessionId(blankSession.id);
    return blankSession;
  };

  const buildRequestContext = (sessionData: BeeSession) => ({
    businesses,
    currentPage: location.pathname,
    conversationSummary: buildConversationSummary(sessionData.messages),
    language: i18n.resolvedLanguage ?? "en",
    pageSection: context.chip,
    pageTitle: context.title,
    profile,
    savedToolsCount,
    selectedText: selectedTextRef.current,
  });

  const openCopilot = (prefill = "", selectedText?: string) => {
    if (prefill) {
      setDraft(prefill);
    }
    selectedTextRef.current = selectedText ?? extractSelectedTextFromPrompt(prefill);
    setCopilotOpen(true);
  };

  const openFullscreen = (prefill = "", selectedText?: string) => {
    if (prefill) {
      setDraft(prefill);
    }
    selectedTextRef.current = selectedText ?? extractSelectedTextFromPrompt(prefill);
    navigate("/ai-assistant");
  };

  const createNewChat = () => {
    const nextSession = createBlankSession();
    setSessions((current) => sortSessions([nextSession, ...current]));
    setActiveSessionId(nextSession.id);
    setDraft("");
  };

  const sendMessage = async (value?: string) => {
    const prompt = (value ?? draft).trim();
    if (!prompt || streaming) {
      return;
    }

    const sessionData = ensureActiveSession();
    const now = new Date().toISOString();
    const userMessage: BeeMessage = {
      content: prompt,
      createdAt: now,
      id: crypto.randomUUID(),
      role: "user",
      status: "ready",
    };
    const assistantMessage: BeeMessage = {
      content: "",
      createdAt: now,
      id: crypto.randomUUID(),
      retryable: false,
      role: "assistant",
      status: "streaming",
    };
    const baseMessages = [...sessionData.messages, userMessage, assistantMessage];

    setDraft("");
    setStreaming(true);
    updateSession(sessionData.id, (session) => ({
      ...session,
      messages: baseMessages,
      summary: buildConversationSummary(baseMessages),
      title: session.messages.some((message) => message.role === "user") ? session.title : buildSessionTitle(prompt),
      updatedAt: now,
    }));

    try {
      const result = await streamBizHiveChat({
        accessToken: session?.access_token,
        context: buildRequestContext({ ...sessionData, messages: baseMessages }),
        messages: buildProviderMessages(baseMessages),
        onChunk: (_chunk, fullResponse) => {
          updateSession(sessionData.id, (session) => ({
            ...session,
            messages: session.messages.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: fullResponse, status: "streaming" }
                : message
            ),
          }));
        },
        sessionId: sessionData.id,
        slotIndexHint: sessionData.slotIndex,
      });

      updateSession(sessionData.id, (session) => ({
        ...session,
        messages: session.messages.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, content: result.text, retryable: false, status: "ready" }
            : message
        ),
        slotIndex: result.slotIndex ?? session.slotIndex,
        summary: buildConversationSummary(
          session.messages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: result.text, status: "ready" as const }
              : message
          )
        ),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      const message =
        error instanceof BeeChatError ? error.message : "Bee hit a temporary issue while preparing that answer.";

      updateSession(sessionData.id, (session) => ({
        ...session,
        messages: session.messages.map((entry) =>
          entry.id === assistantMessage.id
            ? {
                ...entry,
                content: message,
                retryable: error instanceof BeeChatError ? error.retryable : true,
                status: "error",
              }
            : entry
        ),
      }));
    } finally {
      setStreaming(false);
      selectedTextRef.current = null;
    }
  };

  const retryLastMessage = async () => {
    if (!currentSession || streaming) {
      return;
    }

    const failedAssistant = [...currentSession.messages].reverse().find(
      (message) => message.role === "assistant" && message.status === "error"
    );

    if (!failedAssistant) {
      return;
    }

    setStreaming(true);
    updateSession(currentSession.id, (session) => ({
      ...session,
      messages: session.messages.map((message) =>
        message.id === failedAssistant.id
          ? { ...message, content: "", retryable: false, status: "streaming" }
          : message
      ),
    }));

    const providerMessages = buildProviderMessages(
      currentSession.messages.filter((message) => message.id !== failedAssistant.id)
    );

    try {
      const result = await streamBizHiveChat({
        accessToken: session?.access_token,
        context: buildRequestContext(currentSession),
        messages: providerMessages,
        onChunk: (_chunk, fullResponse) => {
          updateSession(currentSession.id, (session) => ({
            ...session,
            messages: session.messages.map((message) =>
              message.id === failedAssistant.id
                ? { ...message, content: fullResponse, status: "streaming" }
                : message
            ),
          }));
        },
        retry: true,
        sessionId: currentSession.id,
        slotIndexHint: currentSession.slotIndex,
      });

      updateSession(currentSession.id, (session) => ({
        ...session,
        messages: session.messages.map((message) =>
          message.id === failedAssistant.id
            ? { ...message, content: result.text, retryable: false, status: "ready" }
            : message
        ),
        slotIndex: result.slotIndex ?? session.slotIndex,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      const message =
        error instanceof BeeChatError ? error.message : "Bee hit a temporary issue while preparing that answer.";

      updateSession(currentSession.id, (session) => ({
        ...session,
        messages: session.messages.map((entry) =>
          entry.id === failedAssistant.id
            ? {
                ...entry,
                content: message,
                retryable: error instanceof BeeChatError ? error.retryable : true,
                status: "error",
              }
            : entry
        ),
      }));
    } finally {
      setStreaming(false);
    }
  };

  const renameSession = async (sessionId: string, title: string) => {
    const nextTitle = buildSessionTitle(title);
    updateSession(sessionId, (session) => ({ ...session, title: nextTitle }));

    if (user) {
      await supabase.from("chat_sessions").update({ title: nextTitle }).eq("id", sessionId).eq("user_id", user.id);
    }
  };

  const archiveSession = async (sessionId: string) => {
    const remaining = sessions.filter((session) => session.id !== sessionId);

    if (user) {
      await supabase
        .from("chat_sessions")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", sessionId)
        .eq("user_id", user.id);
    }

    const nextSessions = remaining.length ? remaining : [createBlankSession()];
    setSessions(sortSessions(nextSessions));
    setActiveSessionId(nextSessions[0]?.id ?? null);
  };

  return (
    <BeeContext.Provider
      value={{
        activeSessionId,
        archiveSession,
        closeCopilot: () => setCopilotOpen(false),
        context,
        copilotOpen,
        createNewChat,
        currentSession,
        draft,
        fullscreen: location.pathname === "/ai-assistant",
        historyLoading,
        messages,
        openCopilot,
        openFullscreen,
        renameSession,
        retryLastMessage,
        selectSession: setActiveSessionId,
        sendMessage,
        sessions,
        setDraft,
        streaming,
      }}
    >
      {children}
    </BeeContext.Provider>
  );
};

export const useBee = () => {
  const context = useContext(BeeContext);
  if (!context) {
    throw new Error("useBee must be used within BeeProvider");
  }
  return context;
};
