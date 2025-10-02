import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import CreateCampaignDialog from "./CreateCampaignDialog";
import EditCampaignDialog from "./EditCampaignDialog";
import CreatePostDialog from "./CreatePostDialog";
import { Campaign } from "@/hooks/useCampaigns";

interface MyCampaignsProps {
  userId: string;
}

const MyCampaigns = ({ userId }: MyCampaignsProps) => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns(userId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const handleDeleteClick = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (campaignToDelete) {
      await deleteCampaign(campaignToDelete);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditDialogOpen(true);
  };

  const handleCreatePostClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setPostDialogOpen(true);
  };

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
          <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha</p>
          <CreateCampaignDialog onCreateCampaign={createCampaign} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minhas Campanhas</h2>
        <CreateCampaignDialog onCreateCampaign={createCampaign} />
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
                    <DropdownMenuItem onClick={() => handleCreatePostClick(campaign)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Criar novo post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(campaign)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar campanha
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(campaign.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir campanha
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaign.category && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Categoria: </span>
                    <span className="capitalize">{campaign.category}</span>
                  </div>
                )}
                {campaign.image_url && (
                  <img 
                    src={campaign.image_url} 
                    alt={campaign.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditCampaignDialog
        campaign={selectedCampaign}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateCampaign={updateCampaign}
      />

      {selectedCampaign && (
        <CreatePostDialog
          campaignId={selectedCampaign.id}
          open={postDialogOpen}
          onOpenChange={setPostDialogOpen}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A campanha e todos os posts relacionados serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyCampaigns;
