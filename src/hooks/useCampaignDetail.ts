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

export interface CampaignPost {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  post_type: string;
  media_url: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignDetail {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useCampaignDetail = (campaignId: string | undefined) => {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [plans, setPlans] = useState<CampaignPlan[]>([]);
  const [posts, setPosts] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignDetail = async () => {
      setLoading(true);
      try {
        // Fetch campaign with profile
        const { data: campaignData, error: campaignError } = await supabase
          .from("campaigns")
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq("id", campaignId)
          .eq("status", "active")
          .single();

        if (campaignError) throw campaignError;
        setCampaign(campaignData);

        // Fetch plans
        const { data: plansData, error: plansError } = await supabase
          .from("campaign_plans")
          .select("*")
          .eq("campaign_id", campaignId)
          .order("price", { ascending: true });

        if (plansError) throw plansError;
        setPlans(plansData || []);

        // Fetch public posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("campaign_id", campaignId)
          .eq("visibility", "all")
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (error: any) {
        console.error("Error fetching campaign detail:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar campanha",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [campaignId, toast]);

  return { campaign, plans, posts, loading };
};
