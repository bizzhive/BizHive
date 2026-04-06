import { supabase } from "@/services/supabase/client";
import { seededTestimonials, type SeedTestimonial } from "@/content/product";

export type FeedbackEntry = {
  created_at?: string | null;
  display_name: string;
  feedback: string;
  id: string;
  is_locked: boolean;
  is_public: boolean;
  profession: string;
  rating: number;
  revision_count: number;
  updated_at?: string | null;
  user_id: string | null;
};

export type FeedbackDraft = {
  display_name: string;
  feedback: string;
  profession: string;
  rating: number;
};

const TABLE_NAME = "public_feedback";

const mapSeed = (seed: SeedTestimonial, index: number): FeedbackEntry => ({
  id: `seed-${index + 1}`,
  user_id: null,
  display_name: seed.display_name,
  profession: seed.profession,
  rating: seed.rating,
  feedback: seed.feedback,
  revision_count: 1,
  is_locked: true,
  is_public: true,
});

const mapRow = (row: any): FeedbackEntry => ({
  id: row.id,
  user_id: row.user_id ?? null,
  display_name: row.display_name,
  profession: row.profession,
  rating: Number(row.rating ?? 5),
  feedback: row.feedback,
  revision_count: Number(row.revision_count ?? 0),
  is_locked: Boolean(row.is_locked),
  is_public: Boolean(row.is_public),
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
});

export const getPublicTestimonials = async (): Promise<FeedbackEntry[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME as any)
    .select("id,user_id,display_name,profession,rating,feedback,revision_count,is_locked,is_public,created_at,updated_at")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  const seeded = seededTestimonials.map(mapSeed);

  if (error || !Array.isArray(data)) {
    return seeded;
  }

  const live = data.map(mapRow);
  return [...live, ...seeded].slice(0, 30);
};

export const getFeedbackForUser = async (userId: string): Promise<FeedbackEntry | null> => {
  const { data, error } = await supabase
    .from(TABLE_NAME as any)
    .select("id,user_id,display_name,profession,rating,feedback,revision_count,is_locked,is_public,created_at,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRow(data);
};

export const saveFeedbackForUser = async (userId: string, draft: FeedbackDraft): Promise<FeedbackEntry> => {
  const existing = await getFeedbackForUser(userId);

  const payload = {
    user_id: userId,
    display_name: draft.display_name.trim(),
    profession: draft.profession.trim(),
    rating: draft.rating,
    feedback: draft.feedback.trim(),
    is_public: true,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    if (existing.is_locked || existing.revision_count >= 1) {
      throw new Error("This feedback entry is already locked.");
    }

    const { data, error } = await supabase
      .from(TABLE_NAME as any)
      .update({
        ...payload,
        revision_count: 1,
        is_locked: true,
      })
      .eq("id", existing.id)
      .select("id,user_id,display_name,profession,rating,feedback,revision_count,is_locked,is_public,created_at,updated_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Unable to update feedback.");
    }

    return mapRow(data);
  }

  const { data, error } = await supabase
    .from(TABLE_NAME as any)
    .insert({
      ...payload,
      revision_count: 0,
      is_locked: false,
    })
    .select("id,user_id,display_name,profession,rating,feedback,revision_count,is_locked,is_public,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to save feedback.");
  }

  return mapRow(data);
};
