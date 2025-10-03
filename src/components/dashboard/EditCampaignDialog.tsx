import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Campaign } from "@/hooks/useCampaigns";

interface EditCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
}

const CATEGORIES = [
  { id: "podcast", label: "Podcast" },
  { id: "video", label: "Vídeo" },
  { id: "musica", label: "Música" },
  { id: "arte", label: "Arte" },
  { id: "fotografia", label: "Fotografia" },
  { id: "design", label: "Design" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "educacao", label: "Educação" },
  { id: "games", label: "Games" },
  { id: "culinaria", label: "Culinária" },
  { id: "esportes", label: "Esportes" },
  { id: "moda", label: "Moda" },
  { id: "saude", label: "Saúde e Bem-estar" },
  { id: "viagem", label: "Viagem" },
  { id: "literatura", label: "Literatura" },
  { id: "cinema", label: "Cinema" },
  { id: "teatro", label: "Teatro" },
  { id: "danca", label: "Dança" },
  { id: "artesanato", label: "Artesanato" },
  { id: "empreendedorismo", label: "Empreendedorismo" },
  { id: "ciencia", label: "Ciência" },
  { id: "meio-ambiente", label: "Meio Ambiente" },
  { id: "outro", label: "Outro" },
];

const EditCampaignDialog = ({ campaign, open, onOpenChange, onUpdateCampaign }: EditCampaignDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    image_url: "",
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        description: campaign.description || "",
        categories: campaign.category || [],
        image_url: campaign.image_url || "",
      });
    }
  }, [campaign]);

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : prev.categories.length < 3
        ? [...prev.categories, categoryId]
        : prev.categories;
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    
    setLoading(true);
    try {
      await onUpdateCampaign(campaign.id, {
        title: formData.title,
        description: formData.description,
        category: formData.categories,
        image_url: formData.image_url,
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Atualize os dados da sua campanha
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Categorias * (selecione de 1 a 3)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${category.id}`}
                    checked={formData.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    disabled={
                      formData.categories.length >= 3 &&
                      !formData.categories.includes(category.id)
                    }
                  />
                  <label
                    htmlFor={`edit-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.categories.length}/3 categorias selecionadas
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-image_url">URL da Imagem</Label>
            <Input
              id="edit-image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignDialog;
