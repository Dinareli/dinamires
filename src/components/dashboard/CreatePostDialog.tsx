import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePostDialogProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostDialog = ({ campaignId, open, onOpenChange }: CreatePostDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    post_type: "text",
    media_url: "",
    visibility: "all",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            campaign_id: campaignId,
            ...formData,
          },
        ]);

      if (error) throw error;

      toast.success("Post criado com sucesso!");
      onOpenChange(false);
      setFormData({
        title: "",
        content: "",
        post_type: "text",
        media_url: "",
        visibility: "all",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Post</DialogTitle>
          <DialogDescription>
            Compartilhe uma atualização com seus apoiadores
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Título *</Label>
            <Input
              id="post-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Título do post"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-content">Conteúdo *</Label>
            <Textarea
              id="post-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Escreva seu post aqui..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="post-type">Tipo</Label>
              <Select
                value={formData.post_type}
                onValueChange={(value) => setFormData({ ...formData, post_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibilidade</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="supporters">Apoiadores</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.post_type === "image" && (
            <div className="space-y-2">
              <Label>Imagem do Post</Label>
              <ImageUpload
                value={formData.media_url}
                onChange={(url) => setFormData({ ...formData, media_url: url || "" })}
              />
            </div>
          )}
          {formData.post_type !== "text" && formData.post_type !== "image" && (
            <div className="space-y-2">
              <Label htmlFor="media-url">URL da Mídia</Label>
              <Input
                id="media-url"
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                placeholder="https://exemplo.com/arquivo.mp4"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
