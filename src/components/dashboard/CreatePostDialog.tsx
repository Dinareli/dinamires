import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Image as ImageIcon, Video, Music, Eye, Lock, Users } from "lucide-react";

interface CreatePostDialogProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;

const CreatePostDialog = ({ campaignId, open, onOpenChange }: CreatePostDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    post_type: "text",
    media_url: "",
    visibility: "all",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("O conteúdo é obrigatório");
      return;
    }

    if (formData.title.length > MAX_TITLE_LENGTH) {
      toast.error(`O título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres`);
      return;
    }

    if (formData.content.length > MAX_CONTENT_LENGTH) {
      toast.error(`O conteúdo deve ter no máximo ${MAX_CONTENT_LENGTH} caracteres`);
      return;
    }

    // Se for imagem e não tiver URL
    if (activeTab === "image" && !formData.media_url) {
      toast.error("Faça upload de uma imagem");
      return;
    }

    // Se for vídeo ou áudio e não tiver URL
    if ((activeTab === "video" || activeTab === "audio") && !formData.media_url.trim()) {
      toast.error("Insira a URL da mídia");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            campaign_id: campaignId,
            title: formData.title.trim(),
            content: formData.content.trim(),
            post_type: activeTab,
            media_url: formData.media_url || null,
            visibility: formData.visibility,
          },
        ]);

      if (error) throw error;

      toast.success("Post publicado com sucesso!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        post_type: "text",
        media_url: "",
        visibility: "all",
      });
      setActiveTab("text");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erro ao publicar post");
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (formData.visibility) {
      case "all":
        return <Eye className="h-4 w-4" />;
      case "supporters":
        return <Users className="h-4 w-4" />;
      case "premium":
        return <Lock className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (formData.visibility) {
      case "all":
        return "Público";
      case "supporters":
        return "Apoiadores";
      case "premium":
        return "Premium";
      default:
        return "Público";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Post</DialogTitle>
          <DialogDescription>
            Compartilhe conteúdo exclusivo com seus apoiadores
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Título */}
          <div className="space-y-2">
            <Label htmlFor="post-title">Título *</Label>
            <Input
              id="post-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Título do post"
              maxLength={MAX_TITLE_LENGTH}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Seja claro e atrativo</span>
              <span>{formData.title.length}/{MAX_TITLE_LENGTH}</span>
            </div>
          </div>

          {/* Seletor de Visibilidade */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidade</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {getVisibilityIcon()}
                  <span>{getVisibilityLabel()}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Público - Todos podem ver</span>
                  </div>
                </SelectItem>
                <SelectItem value="supporters">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Apoiadores - Apenas quem apoia</span>
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Premium - Apenas apoiadores premium</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs de Tipo de Conteúdo */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Texto</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Imagem</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Vídeo</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Áudio</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab de Texto */}
            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="text-content">Conteúdo *</Label>
                <Textarea
                  id="text-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Escreva seu post aqui... Compartilhe suas ideias, atualizações ou qualquer conteúdo que queira dividir com seus apoiadores."
                  rows={8}
                  maxLength={MAX_CONTENT_LENGTH}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Use quebras de linha para organizar o texto</span>
                  <span>{formData.content.length}/{MAX_CONTENT_LENGTH}</span>
                </div>
              </div>

              {/* Preview */}
              {(formData.title || formData.content) && (
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Preview
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getVisibilityLabel()}
                    </Badge>
                  </div>
                  {formData.title && (
                    <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
                  )}
                  {formData.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.content}
                    </p>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* Tab de Imagem */}
            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Imagem *</Label>
                <ImageUpload
                  value={formData.media_url}
                  onChange={(url) => setFormData({ ...formData, media_url: url || "" })}
                />
                <p className="text-xs text-muted-foreground">
                  Faça upload de uma imagem de alta qualidade para acompanhar seu post
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-content">Descrição *</Label>
                <Textarea
                  id="image-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Descreva sua imagem ou adicione contexto..."
                  rows={6}
                  maxLength={MAX_CONTENT_LENGTH}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.content.length}/{MAX_CONTENT_LENGTH}
                </div>
              </div>

              {/* Preview */}
              {(formData.title || formData.media_url) && (
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Preview</Badge>
                    <Badge variant="secondary" className="text-xs">{getVisibilityLabel()}</Badge>
                  </div>
                  {formData.title && (
                    <h3 className="font-semibold text-lg mb-3">{formData.title}</h3>
                  )}
                  {formData.media_url && (
                    <img 
                      src={formData.media_url} 
                      alt="Preview" 
                      className="w-full rounded-lg mb-3 max-h-[300px] object-cover"
                    />
                  )}
                  {formData.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.content}
                    </p>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* Tab de Vídeo */}
            <TabsContent value="video" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">URL do Vídeo *</Label>
                <Input
                  id="video-url"
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Insira o link do YouTube, Vimeo ou outro serviço de vídeo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-content">Descrição *</Label>
                <Textarea
                  id="video-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Descreva o vídeo, o que os apoiadores vão aprender ou descobrir..."
                  rows={6}
                  maxLength={MAX_CONTENT_LENGTH}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.content.length}/{MAX_CONTENT_LENGTH}
                </div>
              </div>

              {/* Preview */}
              {(formData.title || formData.content) && (
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Preview</Badge>
                    <Badge variant="secondary" className="text-xs">{getVisibilityLabel()}</Badge>
                  </div>
                  {formData.title && (
                    <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Video className="h-4 w-4" />
                    <span>Conteúdo em vídeo</span>
                  </div>
                  {formData.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.content}
                    </p>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* Tab de Áudio */}
            <TabsContent value="audio" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="audio-url">URL do Áudio *</Label>
                <Input
                  id="audio-url"
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://soundcloud.com/... ou https://spotify.com/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Insira o link do SoundCloud, Spotify, ou arquivo de áudio direto
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio-content">Descrição *</Label>
                <Textarea
                  id="audio-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Descreva o conteúdo do áudio, duração, tópicos abordados..."
                  rows={6}
                  maxLength={MAX_CONTENT_LENGTH}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.content.length}/{MAX_CONTENT_LENGTH}
                </div>
              </div>

              {/* Preview */}
              {(formData.title || formData.content) && (
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Preview</Badge>
                    <Badge variant="secondary" className="text-xs">{getVisibilityLabel()}</Badge>
                  </div>
                  {formData.title && (
                    <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Music className="h-4 w-4" />
                    <span>Conteúdo em áudio</span>
                  </div>
                  {formData.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.content}
                    </p>
                  )}
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
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
