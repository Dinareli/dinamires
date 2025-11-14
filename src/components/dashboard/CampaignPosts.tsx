import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ArrowLeft, Edit, Trash2, Plus, FileText, Image, Video, Music, Loader2 } from "lucide-react";
import { useCampaignPosts, CampaignPost } from "@/hooks/useCampaignPosts";
import { Campaign } from "@/hooks/useCampaigns";
import CreatePostDialog from "./CreatePostDialog";
import EditPostDialog from "./EditPostDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CampaignPostsProps {
  campaign: Campaign;
  onBack: () => void;
}

const CampaignPosts = ({ campaign, onBack }: CampaignPostsProps) => {
  const { posts, loading, updatePost, deletePost, refetch } = useCampaignPosts(campaign.id);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CampaignPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const handleEditClick = (post: CampaignPost) => {
    setSelectedPost(post);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "image":
        return "Imagem";
      case "video":
        return "Vídeo";
      case "audio":
        return "Áudio";
      default:
        return "Texto";
    }
  };

  const filteredPosts = posts.filter((post) => {
    const typeMatch = typeFilter === "all" || post.post_type === typeFilter;
    const visibilityMatch = visibilityFilter === "all" || post.visibility === visibilityFilter;
    return typeMatch && visibilityMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Posts - {campaign.title}</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie os posts da sua campanha
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Posts Publicados</CardTitle>
              <CardDescription>
                {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="supporters">Apoiadores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Nenhum post encontrado</p>
                <p className="text-sm text-muted-foreground">
                  {posts.length === 0 
                    ? "Comece criando seu primeiro post"
                    : "Tente ajustar os filtros"}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getPostTypeIcon(post.post_type)}
                        <span className="max-w-[300px] truncate">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getPostTypeLabel(post.post_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.visibility === "all" ? "default" : "outline"}>
                        {post.visibility === "all" ? "Todos" : "Apoiadores"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(post.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreatePostDialog
        campaignId={campaign.id}
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) refetch();
        }}
      />

      <EditPostDialog
        post={selectedPost}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={updatePost}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignPosts;
