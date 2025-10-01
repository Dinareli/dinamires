import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

const BrowseCampaigns = () => {
  // Mock data - will be replaced with real data from Supabase
  const campaigns = [
    {
      id: "1",
      name: "Arte Digital com Maria",
      creator: "Maria Silva",
      description: "Ilustrações digitais e tutoriais semanais",
      category: "Arte",
      supporters: 156,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    },
    {
      id: "2",
      name: "Podcast TechTalks",
      creator: "João Santos",
      description: "Conversas sobre tecnologia e startups",
      category: "Tecnologia",
      supporters: 89,
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
    },
    {
      id: "3",
      name: "Fitness na Prática",
      creator: "Ana Costa",
      description: "Treinos e dicas de alimentação saudável",
      category: "Saúde",
      supporters: 234,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <Card 
          key={campaign.id} 
          className="glass-card hover-scale cursor-pointer group overflow-hidden animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="aspect-video relative overflow-hidden">
            <img
              src={campaign.image}
              alt={campaign.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
              {campaign.category}
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-hero text-white text-sm">
                  {campaign.creator.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{campaign.creator}</p>
                <p className="text-xs text-muted-foreground">{campaign.supporters} apoiadores</p>
              </div>
            </div>
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
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
