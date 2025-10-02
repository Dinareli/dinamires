import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Campaign {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", userId],
    queryFn: async () => {
      let query = supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("owner_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!userId || userId === undefined,
  });

  const createCampaign = useMutation({
    mutationFn: async (newCampaign: Omit<Campaign, "id" | "created_at" | "updated_at" | "status">) => {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([newCampaign])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar campanha: ${error.message}`);
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar campanha: ${error.message}`);
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir campanha: ${error.message}`);
    },
  });

  return {
    campaigns: campaigns || [],
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};
