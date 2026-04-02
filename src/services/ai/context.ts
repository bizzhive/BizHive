import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

export type UserAiContext = {
  profile: Tables<"profiles"> | null;
  businesses: Tables<"businesses">[] | null;
  saved_tools: Pick<Tables<"saved_tools">, "tool_type" | "title" | "data">[] | null;
};

export const fetchUserAiContext = async (userId: string): Promise<UserAiContext> => {
  const [{ data: profile }, { data: businesses }, { data: savedTools }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("businesses").select("*").eq("user_id", userId),
    supabase.from("saved_tools").select("tool_type, title, data").eq("user_id", userId),
  ]);

  return {
    profile: profile ?? null,
    businesses: businesses ?? null,
    saved_tools: savedTools ?? null,
  };
};
