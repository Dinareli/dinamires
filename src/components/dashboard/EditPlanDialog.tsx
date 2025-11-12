import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { CampaignPlan } from "@/hooks/useCampaignPlans";

interface EditPlanDialogProps {
  plan: CampaignPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdatePlan: (planId: string, planData: {
    name: string;
    description: string;
    price: number;
    benefits: string[];
  }) => Promise<any>;
}

const EditPlanDialog = ({ plan, open, onOpenChange, onUpdatePlan }: EditPlanDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDescription(plan.description || "");
      setPrice(plan.price.toString());
      setBenefits(plan.benefits && plan.benefits.length > 0 ? plan.benefits : [""]);
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !name.trim() || !price) return;

    setLoading(true);
    try {
      const filteredBenefits = benefits.filter((b) => b.trim() !== "");
      await onUpdatePlan(plan.id, {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        benefits: filteredBenefits,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano de Apoio</DialogTitle>
          <DialogDescription>
            Atualize as informações do plano de apoio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Plano *</Label>
            <Input
              id="edit-name"
              placeholder="Ex: Apoiador Bronze"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Valor Mensal (R$) *</Label>
            <Input
              id="edit-price"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              placeholder="Descreva o que este plano oferece..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Benefícios</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="gap-2">
                <Plus className="h-3 w-3" />
                Adicionar Benefício
              </Button>
            </div>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Benefício ${index + 1}`}
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    maxLength={200}
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || !price}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog;
