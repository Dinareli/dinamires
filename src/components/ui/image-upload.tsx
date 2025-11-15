import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  bucket?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  bucket = "campaign-images",
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Validar tipo
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Tipo de arquivo não permitido. Use: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
      return false;
    }

    // Validar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simular progresso (Supabase não fornece progresso real)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress(100);
      onChange(publicUrl);
      toast.success("Imagem carregada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(error.message || "Erro ao fazer upload da imagem");
      setPreview("");
      onChange(null);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-2 w-3/4">
                  <p className="text-sm text-muted-foreground">Enviando...</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{progress}%</p>
                </div>
              </div>
            )}
          </div>
          {!uploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-40 border-dashed border-2 hover:border-primary hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <Upload className="h-8 w-8 animate-pulse" />
                <p className="text-sm">Enviando...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-sm font-medium">Clique para selecionar uma imagem</p>
                  <p className="text-xs mt-1">
                    Máximo {maxSizeMB}MB • {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
                  </p>
                </div>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
};
