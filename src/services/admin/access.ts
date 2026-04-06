import { createSupabaseFunctionHeaders, getSupabaseFunctionUrl } from "@/services/supabase/client";

const TEMP_ADMIN_ACCESS_KEY = "bizhive.admin.access";
const TEMP_ADMIN_PASSWORD_KEY = "bizhive.admin.password";
const TEMP_ADMIN_PASSWORD = "admin#Tushar07";

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
  window.sessionStorage.removeItem(TEMP_ADMIN_PASSWORD_KEY);
};

export const getTemporaryAdminPassword = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(TEMP_ADMIN_PASSWORD_KEY);
};

export const verifyTemporaryAdminPassword = async (password: string) => {
  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    throw new Error("Enter the admin password.");
  }

  try {
    const response = await fetch(getSupabaseFunctionUrl("admin-access"), {
      method: "POST",
      headers: createSupabaseFunctionHeaders(),
      body: JSON.stringify({ password: trimmedPassword }),
    });

    if (response.ok) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(TEMP_ADMIN_ACCESS_KEY, "granted");
        window.sessionStorage.setItem(TEMP_ADMIN_PASSWORD_KEY, trimmedPassword);
      }
      return true;
    }

    if (response.status !== 404) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error || "Incorrect admin password.");
    }
  } catch (error) {
    if (!(error instanceof Error) || !/Failed to fetch/i.test(error.message)) {
      if (error instanceof Error && !/404/.test(error.message)) {
        throw error;
      }
    }
  }

  if (trimmedPassword !== TEMP_ADMIN_PASSWORD) {
    throw new Error("Incorrect admin password.");
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(TEMP_ADMIN_ACCESS_KEY, "granted");
    window.sessionStorage.setItem(TEMP_ADMIN_PASSWORD_KEY, trimmedPassword);
  }

  return true;
};
