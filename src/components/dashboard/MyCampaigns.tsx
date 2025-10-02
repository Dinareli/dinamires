import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Settings, Trash2, FileText, Plus } from "lucide-react";
import { useCampaigns, Campaign } from "@/hooks/useCampaigns";
import CreateCampaignDialog from "./CreateCampaignDialog";
import EditCampaignDialog from "./EditCampaignDialog";
import DeleteCampaignDialog from "./DeleteCampaignDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface MyCampaignsProps {
  userId: string;
}

const MyCampaigns = ({ userId }: MyCampaignsProps) => {
  const { campaigns, isLoading } = useCampaigns(userId);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <>
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira campanha
            </Button>
          </CardContent>
        </Card>
        <CreateCampaignDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          userId={userId}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign, index) => (
          <Card 
            key={campaign.id} 
            className="glass-card hover-scale group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {campaign.description || "Sem descrição"}
                  </CardDescription>
                  {campaign.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {campaign.category}
                    </span>
                  )}
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
                    <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar campanha
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Gerenciar campanha
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(campaign)}
                    >
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
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita/mês</p>
                  <p className="text-2xl font-bold">R$ 0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateCampaignDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        userId={userId}
      />

      <EditCampaignDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        campaign={selectedCampaign}
      />

      <DeleteCampaignDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        campaign={selectedCampaign}
      />
    </>
  );
};

export default MyCampaigns;
