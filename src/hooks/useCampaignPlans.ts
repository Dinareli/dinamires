import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CampaignPlan {
  id: string;
  campaign_id: string;
  name: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
  created_at: string;
}

export const useCampaignPlans = (campaignId: string) => {
  const [plans, setPlans] = useState<CampaignPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("campaign_plans")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar planos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchPlans();
    }
  }, [campaignId]);

  const createPlan = async (planData: {
    name: string;
    description: string;
    price: number;
    benefits: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from("campaign_plans")
        .insert([
          {
            campaign_id: campaignId,
            name: planData.name,
            description: planData.description,
            price: planData.price,
            benefits: planData.benefits,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPlans([...plans, data]);
      toast({
        title: "Plano criado!",
        description: "O plano de apoio foi criado com sucesso.",
      });
      return data;
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar plano",
        description: error.message,
      });
      throw error;
    }
  };

  const updatePlan = async (
    planId: string,
    planData: {
      name: string;
      description: string;
      price: number;
      benefits: string[];
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from("campaign_plans")
        .update({
          name: planData.name,
          description: planData.description,
          price: planData.price,
          benefits: planData.benefits,
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) throw error;

      setPlans(plans.map((plan) => (plan.id === planId ? data : plan)));
      toast({
        title: "Plano atualizado!",
        description: "O plano de apoio foi atualizado com sucesso.",
      });
      return data;
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar plano",
        description: error.message,
      });
      throw error;
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from("campaign_plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;

      setPlans(plans.filter((plan) => plan.id !== planId));
      toast({
        title: "Plano excluído!",
        description: "O plano de apoio foi excluído com sucesso.",
      });
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir plano",
        description: error.message,
      });
      throw error;
    }
  };

  return {
    plans,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlans,
  };
};
