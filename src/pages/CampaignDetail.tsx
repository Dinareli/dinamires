import { useParams, useNavigate } from "react-router-dom";
import { useCampaignDetail } from "@/hooks/useCampaignDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanCard } from "@/components/campaign/PlanCard";
import { PostCard } from "@/components/campaign/PostCard";
import { ArrowLeft, User } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect } from "react";

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaign, plans, posts, loading } = useCampaignDetail(id);

  useEffect(() => {
    if (!loading && !campaign) {
      navigate("/404");
    }
  }, [loading, campaign, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12 max-w-7xl">
        {/* Campaign Header */}
        <div className="space-y-6 animate-fade-in">
          {campaign.image_url && (
            <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-xl">
              <img
                src={campaign.image_url}
                alt={campaign.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarImage src={campaign.profiles?.avatar_url || ""} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  {campaign.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  por {campaign.profiles?.full_name || "Usuário"}
                </p>
              </div>
            </div>

            {campaign.category && campaign.category.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {campaign.category.map((cat, index) => (
                  <Badge key={index} variant="static">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {campaign.description && (
              <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            )}
          </div>
        </div>

        {/* Support Plans Section */}
        {plans.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Planos de Apoio</h2>
              <p className="text-muted-foreground">
                Escolha um plano e apoie este projeto
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  benefits={plan.benefits}
                />
              ))}
            </div>
          </section>
        )}

        {/* Posts Section */}
        {posts.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Atualizações Públicas</h2>
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? "publicação" : "publicações"}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  post_type={post.post_type}
                  media_url={post.media_url}
                  created_at={post.created_at}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty States */}
        {plans.length === 0 && posts.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              Esta campanha ainda não possui planos de apoio ou publicações.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
