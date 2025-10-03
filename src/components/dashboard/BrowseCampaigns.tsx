import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Loader2 } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";

const BrowseCampaigns = () => {
  const { campaigns, loading } = useCampaigns();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhuma campanha disponível no momento</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <Card 
          key={campaign.id} 
          className="glass-card hover-scale cursor-pointer group overflow-hidden animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {campaign.image_url && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={campaign.image_url}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {campaign.category && campaign.category.length > 0 && (
                <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                  {campaign.category.slice(0, 2).map((cat) => (
                    <Badge key={cat} className="bg-background/90 backdrop-blur-sm capitalize text-xs">
                      {cat}
                    </Badge>
                  ))}
                  {campaign.category.length > 2 && (
                    <Badge className="bg-background/90 backdrop-blur-sm text-xs">
                      +{campaign.category.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
          <CardHeader>
            {campaign.profiles && (
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={campaign.profiles.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-hero text-white text-sm">
                    {campaign.profiles.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {campaign.profiles.full_name || "Criador"}
                  </p>
                </div>
              </div>
            )}
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {campaign.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gap-2">
              <Heart className="w-4 h-4" />
              Apoiar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrowseCampaigns;
