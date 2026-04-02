import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/services/supabase/database.types";

type AdminAuditInsert = Database["public"]["Tables"]["admin_audit_logs"]["Insert"];

export type AdminAuditPayload = {
  action: string;
  actorName?: string | null;
  actorRole: string;
  details?: Json;
  entityId?: string | null;
  entityType: string;
  summary: string;
  userId: string;
};

export const recordAdminAudit = async (
  client: SupabaseClient<Database>,
  payload: AdminAuditPayload
) => {
  const auditRow: AdminAuditInsert = {
    action: payload.action,
    actor_name: payload.actorName ?? null,
    actor_role: payload.actorRole,
    actor_user_id: payload.userId,
    details: payload.details ?? {},
    entity_id: payload.entityId ?? null,
    entity_type: payload.entityType,
    summary: payload.summary,
  };

  const { error } = await client.from("admin_audit_logs").insert(auditRow);
  if (error) {
    console.error("Failed to record admin audit log", error);
  }
};
