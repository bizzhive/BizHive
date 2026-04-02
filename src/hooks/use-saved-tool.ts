import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase/client";
import type { Database } from "@/services/supabase/database.types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type ToolType = Database['public']['Enums']['tool_type'];

export function useSavedTool<T>(toolType: ToolType, defaultData: T) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ['saved_tool', toolType, user?.id];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return defaultData;

      const { data, error } = await supabase
        .from('saved_tools')
        .select('*')
        .eq('tool_type', toolType)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tool:', error);
        return defaultData;
      }

      if (data && data.data) {
        return data.data as unknown as T;
      }
      return defaultData;
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (newData: T) => {
      if (!user) throw new Error("Must be logged in to save");

      const { error } = await supabase
        .from('saved_tools')
        .insert({
          user_id: user.id,
          tool_type: toolType,
          data: newData as never,
          title: `Saved ${toolType.replace('_', ' ')}`,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Progress saved successfully to the cloud!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error("Failed to save progress: " + error.message);
    }
  });

  return {
    data: data || defaultData,
    isLoading,
    save: mutation.mutate,
    isSaving: mutation.isPending
  };
}
