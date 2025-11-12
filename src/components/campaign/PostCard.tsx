import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Image as ImageIcon, Video } from "lucide-react";

interface PostCardProps {
  title: string;
  content: string;
  post_type: string;
  media_url: string | null;
  created_at: string;
}

export const PostCard = ({ title, content, post_type, media_url, created_at }: PostCardProps) => {
  const getPostTypeIcon = () => {
    switch (post_type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPostTypeLabel = () => {
    switch (post_type) {
      case "image":
        return "Imagem";
      case "video":
        return "Vídeo";
      default:
        return "Texto";
    }
  };

  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <Badge variant="static" className="shrink-0 flex items-center gap-1">
            {getPostTypeIcon()}
            {getPostTypeLabel()}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { 
            addSuffix: true, 
            locale: ptBR 
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {media_url && post_type === "image" && (
          <img 
            src={media_url} 
            alt={title}
            className="w-full rounded-lg object-cover max-h-64"
          />
        )}
        {media_url && post_type === "video" && (
          <video 
            src={media_url} 
            controls
            className="w-full rounded-lg max-h-64"
          />
        )}
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};
