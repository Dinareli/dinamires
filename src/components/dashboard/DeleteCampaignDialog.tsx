import { useState } from "react";
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
import { useCampaigns, Campaign } from "@/hooks/useCampaigns";

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
}

const DeleteCampaignDialog = ({ open, onOpenChange, campaign }: DeleteCampaignDialogProps) => {
  const { deleteCampaign } = useCampaigns();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!campaign) return;
    
    setIsDeleting(true);
    await deleteCampaign(campaign.id);
    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A campanha "{campaign?.title}" e todos os seus posts
            serão excluídos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCampaignDialog;
