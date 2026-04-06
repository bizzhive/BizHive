import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type BeeMessage = {
  content: string;
  id: string;
  role: "assistant" | "user";
};

type BeeRouteContext = {
  chip: string;
  description: string;
  title: string;
};

type BeeContextValue = {
  closeCopilot: () => void;
  copilotOpen: boolean;
  context: BeeRouteContext;
  draft: string;
  fullscreen: boolean;
  messages: BeeMessage[];
  openCopilot: (prefill?: string) => void;
  openFullscreen: (prefill?: string) => void;
  setDraft: (value: string) => void;
  sendMessage: (value?: string) => void;
};

const BEE_ROUTE_CONTEXT: Record<string, BeeRouteContext> = {
  "/": {
    title: "Home",
    chip: "Overview",
    description: "Use Bee to understand product features, pick the right workspace, or decide what to do next.",
  },
  "/dashboard": {
    title: "Dashboard",
    chip: "Workspace",
    description: "Bee can help explain profile fields, saved work, signature setup, and the next best action.",
  },
  "/plan": {
    title: "Plan",
    chip: "Planning",
    description: "Ask Bee about validation, market research, customer understanding, and your business plan workflow.",
  },
  "/launch": {
    title: "Launch",
    chip: "Execution",
    description: "Bee can help break down launch readiness, registrations, taxation, and legal prep.",
  },
  "/manage": {
    title: "Grow",
    chip: "Operations",
    description: "Use Bee for growth planning, weekly operating rhythm, and funding preparation context.",
  },
  "/tools": {
    title: "Tools",
    chip: "Builder",
    description: "Bee can help you decide which tool to use, how to fill it, and what output matters most.",
  },
  "/incubators": {
    title: "Incubators",
    chip: "Funding",
    description: "Bee can help summarize funding routes, pitch preparation, and which incubators to shortlist.",
  },
  "/community": {
    title: "Community",
    chip: "Discussion",
    description: "Bee sees that you are in community, but it should not inject itself into member-authored discussions.",
  },
  "/documents": {
    title: "Library",
    chip: "Resources",
    description: "Ask Bee about official filings, document templates, and which resource to open next.",
  },
  "/legal": {
    title: "Legal Studio",
    chip: "Legal",
    description: "Bee can explain document fields, signature steps, and how to use a template draft.",
  },
  "/ai-assistant": {
    title: "Bee AI",
    chip: "Assistant",
    description: "This is the fullscreen Bee workspace for longer questions and context-aware help.",
  },
};

const initialMessages: BeeMessage[] = [
  {
    id: "bee-welcome",
    role: "assistant",
    content:
      "Bee is in preview mode right now. I can still help you understand the current screen, suggest next steps, and prepare prompts for the full AI layer.",
  },
];

const BeeContext = createContext<BeeContextValue | undefined>(undefined);

const buildPreviewResponse = (prompt: string, context: BeeRouteContext): string => {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    return "Ask me about the current workflow, a selected term, or what to do next on this screen.";
  }

  const meaningMatch = cleanPrompt.match(/meaning of \"(.+?)\"/i);
  if (meaningMatch?.[1]) {
    return `Preview explanation for "${meaningMatch[1]}": Bee will use the current ${context.title} context to explain terms in a simple, founder-friendly way once live AI is reconnected.`;
  }

  return `Preview answer for ${context.title}: I would focus on ${context.description.toLowerCase()} Start with the clearest next action on this page, then use the saved workspace or learning path to keep momentum.`;
};

export const BeeProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<BeeMessage[]>(initialMessages);

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

  useEffect(() => {
    document.body.dataset.beeSurface = context.title;
  }, [context.title]);

  const openCopilot = (prefill = "") => {
    if (prefill) {
      setDraft(prefill);
    }
    setCopilotOpen(true);
  };

  const openFullscreen = (prefill = "") => {
    if (prefill) {
      setDraft(prefill);
    }
    navigate("/ai-assistant");
  };

  const sendMessage = (value?: string) => {
    const prompt = (value ?? draft).trim();
    if (!prompt) {
      return;
    }

    const userMessage: BeeMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
    };
    const assistantMessage: BeeMessage = {
      id: `assistant-${Date.now() + 1}`,
      role: "assistant",
      content: buildPreviewResponse(prompt, context),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft("");
  };

  return (
    <BeeContext.Provider
      value={{
        context,
        draft,
        messages,
        setDraft,
        sendMessage,
        openCopilot,
        closeCopilot: () => setCopilotOpen(false),
        copilotOpen,
        openFullscreen,
        fullscreen: location.pathname === "/ai-assistant",
      }}
    >
      {children}
      {copilotOpen ? null : null}
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
