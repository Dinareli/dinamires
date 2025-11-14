import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useCampaignPosts = (campaignId: string) => {
  const [posts, setPosts] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar posts",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchPosts();
    }
  }, [campaignId]);

  const updatePost = async (postId: string, data: Partial<CampaignPost>) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update(data)
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post atualizado com sucesso!",
      });
      fetchPosts();
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar post",
        description: error.message,
      });
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post excluído com sucesso!",
      });
      fetchPosts();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir post",
        description: error.message,
      });
      throw error;
    }
  };

  return {
    posts,
    loading,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
};
