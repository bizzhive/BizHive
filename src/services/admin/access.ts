import { createSupabaseFunctionHeaders, getSupabaseFunctionUrl } from "@/services/supabase/client";

const TEMP_ADMIN_ACCESS_KEY = "bizhive.admin.access";

export const hasTemporaryAdminAccess = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(TEMP_ADMIN_ACCESS_KEY) === "granted";
};

export const clearTemporaryAdminAccess = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(TEMP_ADMIN_ACCESS_KEY);
};

export const verifyTemporaryAdminPassword = async (password: string) => {
  const response = await fetch(getSupabaseFunctionUrl("admin-access"), {
    method: "POST",
    headers: createSupabaseFunctionHeaders(),
    body: JSON.stringify({ password }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    authorized?: boolean;
    error?: string;
  };

  if (!response.ok || !payload.authorized) {
    throw new Error(payload.error || "Incorrect temporary admin password.");
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(TEMP_ADMIN_ACCESS_KEY, "granted");
  }

  return true;
};
