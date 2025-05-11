"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewsItem } from "@/types/news";
import { toast } from "sonner";
import { X } from "lucide-react";

interface AnnouncementModalProps {
  announcement: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: NewsItem) => void;
  onDelete: (id: string) => void;
}

export function AnnouncementModal({
  announcement,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: AnnouncementModalProps) {
  const [formData, setFormData] = useState<NewsItem | null>(announcement);
  const [isLoading, setIsLoading] = useState(false);

  // Form verilerini güncelle
  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    }
  }, [announcement]);

  // Form verilerini güncelle
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Duyuruyu kaydet
  const handleSave = async () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      // Duyuruyu güncelle
      onSave(formData);
      toast.success("Duyuru başarıyla güncellendi", {
        description: "Duyuru bilgileri kaydedildi.",
        position: "top-right",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast.error("Duyuru güncellenirken bir hata oluştu", {
        description: "Lütfen daha sonra tekrar deneyin.",
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Duyuruyu sil
  const handleDelete = async () => {
    if (!formData?.id) return;

    setIsLoading(true);
    try {
      // Duyuruyu sil
      onDelete(formData.id);
      toast.success("Duyuru başarıyla silindi", {
        description: "Duyuru listeden kaldırıldı.",
        position: "top-right",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast.error("Duyuru silinirken bir hata oluştu", {
        description: "Lütfen daha sonra tekrar deneyin.",
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duyuru Düzenle</DialogTitle>
          <DialogDescription>
            Duyuru bilgilerini güncelleyin veya duyuruyu silin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Duyuru başlığı"
            />
          </div>

          {/* İçerik */}
          <div className="space-y-2">
            <Label htmlFor="content">İçerik</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Duyuru içeriği"
              className="min-h-[100px]"
            />
          </div>

          {/* Görsel URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Görsel URL</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                placeholder="Görsel URL'si"
              />
              {formData.image && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setFormData((prev) =>
                      prev ? { ...prev, image: "", hasImage: false } : null
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Duyuruyu Sil
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
