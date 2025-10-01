import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Settings, Trash2, FileText } from "lucide-react";

interface MyCampaignsProps {
  userId: string;
}

const MyCampaigns = ({ userId }: MyCampaignsProps) => {
  // Mock data - will be replaced with real data from Supabase
  const campaigns = [
    {
      id: "1",
      name: "Camillando",
      description: "Podcast semanal sobre tecnologia e inovação",
      supporters: 42,
      monthlyRevenue: 840,
    },
    {
      id: "2",
      name: "Dinando",
      description: "Vídeos educativos sobre programação",
      supporters: 28,
      monthlyRevenue: 560,
    },
    {
      id: "3",
      name: "Testando",
      description: "Testes de produtos e reviews",
      supporters: 15,
      monthlyRevenue: 300,
    },
  ];

  if (campaigns.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha</p>
          <Button>Criar primeira campanha</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <Card 
          key={campaign.id} 
          className="glass-card hover-scale cursor-pointer group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{campaign.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {campaign.description}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Criar novo post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar campanha
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Gerenciar campanha
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir campanha
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Apoiadores</p>
                <p className="text-2xl font-bold">{campaign.supporters}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita/mês</p>
                <p className="text-2xl font-bold">
                  R$ {campaign.monthlyRevenue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyCampaigns;
