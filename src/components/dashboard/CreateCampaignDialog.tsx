import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Upload, X, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface PlanData {
  name: string;
  description: string;
  price: string;
  benefits: string[];
}

interface CreateCampaignDialogProps {
  onCreateCampaign: (data: {
    title: string;
    description: string;
    category: string[];
    image_url?: string;
    plans: PlanData[];
  }) => Promise<any>;
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

const CreateCampaignDialog = ({ onCreateCampaign }: CreateCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [plans, setPlans] = useState<PlanData[]>([
    { name: "", description: "", price: "", benefits: [""] }
  ]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setUploading(false);
    }
  };

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

  const addPlan = () => {
    setPlans([...plans, { name: "", description: "", price: "", benefits: [""] }]);
  };

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index));
    }
  };

  const updatePlan = (index: number, field: keyof PlanData, value: string) => {
    const newPlans = [...plans];
    if (field === 'benefits') {
      return; // Benefits are handled separately
    }
    newPlans[index] = { ...newPlans[index], [field]: value };
    setPlans(newPlans);
  };

  const addBenefit = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].benefits.push("");
    setPlans(newPlans);
  };

  const removeBenefit = (planIndex: number, benefitIndex: number) => {
    const newPlans = [...plans];
    if (newPlans[planIndex].benefits.length > 1) {
      newPlans[planIndex].benefits = newPlans[planIndex].benefits.filter((_, i) => i !== benefitIndex);
      setPlans(newPlans);
    }
  };

  const updateBenefit = (planIndex: number, benefitIndex: number, value: string) => {
    const newPlans = [...plans];
    newPlans[planIndex].benefits[benefitIndex] = value;
    setPlans(newPlans);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      toast.error("Selecione pelo menos uma categoria");
      return;
    }

    // Validate plans
    const validPlans = plans.filter(plan => 
      plan.name.trim() !== "" && plan.price.trim() !== "" && parseFloat(plan.price) > 0
    );

    if (validPlans.length === 0) {
      toast.error("Adicione pelo menos um plano válido com nome e valor");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      
      await onCreateCampaign({
        title: formData.title,
        description: formData.description,
        category: formData.categories,
        image_url: imageUrl || undefined,
        plans: validPlans,
      });
      
      setOpen(false);
      setFormData({ title: "", description: "", categories: [], image_url: "" });
      setImageFile(null);
      setImagePreview("");
      setPlans([{ name: "", description: "", price: "", benefits: [""] }]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar campanha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
          <DialogDescription>
            Preencha os dados da sua campanha
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Meu Podcast Semanal"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Conte sobre sua campanha..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Categorias * (selecione de 1 a 3)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={formData.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    disabled={
                      formData.categories.length >= 3 &&
                      !formData.categories.includes(category.id)
                    }
                  />
                  <label
                    htmlFor={category.id}
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
            <Label>Imagem da Campanha</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 cursor-pointer border rounded-md px-4 py-2 hover:bg-accent"
                  >
                    <Upload className="h-4 w-4" />
                    Fazer Upload
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Cole a URL da imagem"
                />
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Planos de Apoio *</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure os planos que seus apoiadores podem escolher
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addPlan} className="gap-2">
                <Plus className="h-3 w-3" />
                Adicionar Plano
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {plans.map((plan, planIndex) => (
                <div key={planIndex} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Plano {planIndex + 1}</Label>
                    {plans.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlan(planIndex)}
                        className="h-8 gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remover
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`plan-name-${planIndex}`} className="text-xs">
                        Nome do Plano *
                      </Label>
                      <Input
                        id={`plan-name-${planIndex}`}
                        placeholder="Ex: Apoiador Bronze"
                        value={plan.name}
                        onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`plan-price-${planIndex}`} className="text-xs">
                        Valor Mensal (R$) *
                      </Label>
                      <Input
                        id={`plan-price-${planIndex}`}
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={plan.price}
                        onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`plan-description-${planIndex}`} className="text-xs">
                      Descrição
                    </Label>
                    <Textarea
                      id={`plan-description-${planIndex}`}
                      placeholder="Descreva o que este plano oferece..."
                      value={plan.description}
                      onChange={(e) => updatePlan(planIndex, 'description', e.target.value)}
                      rows={2}
                      maxLength={500}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Benefícios</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addBenefit(planIndex)}
                        className="h-7 gap-1 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {plan.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex gap-2">
                          <Input
                            placeholder={`Benefício ${benefitIndex + 1}`}
                            value={benefit}
                            onChange={(e) => updateBenefit(planIndex, benefitIndex, e.target.value)}
                            maxLength={200}
                            className="text-sm"
                          />
                          {plan.benefits.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBenefit(planIndex, benefitIndex)}
                              className="h-9 w-9"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading || uploading ? "Criando..." : "Criar Campanha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
