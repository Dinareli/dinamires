import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MySupportProps {
  userId: string;
}

const MySupport = ({ userId }: MySupportProps) => {
  // Mock data - will be replaced with real data from Supabase
  const supportedCampaigns = [
    {
      id: "1",
      name: "Podcast Diário",
      creator: "Carlos Mendes",
      plan: "Apoiador Premium",
      amount: 29.90,
      since: "Janeiro 2024",
    },
    {
      id: "2",
      name: "Vídeos de Culinária",
      creator: "Fernanda Lima",
      plan: "Apoiador Básico",
      amount: 14.90,
      since: "Março 2024",
    },
  ];

  if (supportedCampaigns.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não apoia nenhuma campanha</p>
          <Button>Explorar campanhas</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {supportedCampaigns.map((campaign, index) => (
        <Card 
          key={campaign.id} 
          className="glass-card hover-scale cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-hero text-white">
                    {campaign.creator.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.creator}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">{campaign.plan}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor mensal</p>
                <p className="text-xl font-bold">R$ {campaign.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Apoiando desde {campaign.since}</p>
              </div>
              <Button variant="outline">Ver campanha</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MySupport;
