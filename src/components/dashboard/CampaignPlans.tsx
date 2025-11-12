import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Check } from "lucide-react";
import { useCampaignPlans, CampaignPlan } from "@/hooks/useCampaignPlans";
import CreatePlanDialog from "./CreatePlanDialog";
import EditPlanDialog from "./EditPlanDialog";

interface CampaignPlansProps {
  campaignId: string;
  campaignTitle: string;
}

const CampaignPlans = ({ campaignId, campaignTitle }: CampaignPlansProps) => {
  const { plans, loading, createPlan, updatePlan, deletePlan } = useCampaignPlans(campaignId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CampaignPlan | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      await deletePlan(planToDelete);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleEditClick = (plan: CampaignPlan) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{campaignTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {plans.length} {plans.length === 1 ? "plano cadastrado" : "planos cadastrados"}
          </p>
        </div>
        <CreatePlanDialog onCreatePlan={createPlan} />
      </div>

      {plans.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum plano de apoio cadastrado</p>
            <CreatePlanDialog onCreatePlan={createPlan} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={plan.id} className="glass-card animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(Number(plan.price))}
                      </span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {plan.description && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              {plan.benefits && plan.benefits.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Benefícios</p>
                    <ul className="space-y-1.5">
                      {plan.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground line-clamp-2">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.benefits.length > 3 && (
                      <Badge variant="static" className="text-xs">
                        +{plan.benefits.length - 3} benefícios
                      </Badge>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <EditPlanDialog
        plan={selectedPlan}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdatePlan={updatePlan}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O plano de apoio será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignPlans;
