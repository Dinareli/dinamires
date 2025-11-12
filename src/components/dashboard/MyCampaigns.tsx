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
import { MoreVertical, Edit, Trash2, FileText, Loader2, DollarSign } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import CreateCampaignDialog from "./CreateCampaignDialog";
import EditCampaignDialog from "./EditCampaignDialog";
import CreatePostDialog from "./CreatePostDialog";
import CampaignPlans from "./CampaignPlans";
import { Campaign } from "@/hooks/useCampaigns";
import { Link } from "react-router-dom";

interface MyCampaignsProps {
  userId: string;
}

const MyCampaigns = ({ userId }: MyCampaignsProps) => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns(userId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [plansView, setPlansView] = useState(false);
  const [plansForCampaign, setPlansForCampaign] = useState<Campaign | null>(null);
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

  const handleManagePlansClick = (campaign: Campaign) => {
    setPlansForCampaign(campaign);
    setPlansView(true);
  };

  if (plansView && plansForCampaign) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setPlansView(false)} className="gap-2">
          ← Voltar para Campanhas
        </Button>
        <CampaignPlans 
          campaignId={plansForCampaign.id} 
          campaignTitle={plansForCampaign.title}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-muted-foreground mb-6">Você ainda não criou nenhuma campanha</p>
        <CreateCampaignDialog onCreateCampaign={createCampaign} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold">Minhas Campanhas</h2>
          <p className="text-muted-foreground">Gerencie suas campanhas de apoio</p>
        </div>
        <CreateCampaignDialog onCreateCampaign={createCampaign} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign, index) => (
          <div key={campaign.id} className="relative">
            <Link to={`/campaign/${campaign.id}`}>
              <Card 
                className="glass-card hover-scale group animate-fade-in h-full"
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
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative z-10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleManagePlansClick(campaign)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Gerenciar planos
                        </DropdownMenuItem>
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
                  <div className="space-y-3">
                    {campaign.category && campaign.category.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.category.map((cat) => (
                          <span key={cat} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                            {cat}
                          </span>
                        ))}
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
            </Link>
          </div>
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
