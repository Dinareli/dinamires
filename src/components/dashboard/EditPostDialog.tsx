import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignPost } from "@/hooks/useCampaignPosts";

interface EditPostDialogProps {
  post: CampaignPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (postId: string, data: Partial<CampaignPost>) => Promise<void>;
}

const EditPostDialog = ({ post, open, onOpenChange, onUpdate }: EditPostDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    post_type: "text",
    media_url: "",
    visibility: "all",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        post_type: post.post_type,
        media_url: post.media_url || "",
        visibility: post.visibility,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setLoading(true);
    try {
      await onUpdate(post.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Post</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias no seu post
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-post-title">Título *</Label>
            <Input
              id="edit-post-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Título do post"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-post-content">Conteúdo *</Label>
            <Textarea
              id="edit-post-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Escreva seu post aqui..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-post-type">Tipo</Label>
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
              <Label htmlFor="edit-visibility">Visibilidade</Label>
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
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.post_type !== "text" && (
            <div className="space-y-2">
              <Label htmlFor="edit-media-url">URL da Mídia</Label>
              <Input
                id="edit-media-url"
                type="url"
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                placeholder="https://exemplo.com/media"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
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

export default EditPostDialog;
