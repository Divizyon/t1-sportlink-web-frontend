"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews";
import { Loader2, Globe, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export function NewsUrlInput() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNewsFromUrl } = useNews();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsLoading(true);
      setError(null);

      // URL'yi doğrula
      let validUrl;
      try {
        validUrl = new URL(url);
        if (!validUrl.protocol.startsWith('http')) {
          throw new Error('Geçersiz protokol');
        }
      } catch {
        setError("Lütfen geçerli bir URL girin (örn: https://www.example.com)");
        return;
      }

      const result = await addNewsFromUrl(url);
      
      if (result.error) {
        setError(result.error);
      } else if (result.count) {
        toast({
          title: "Haberler başarıyla alındı",
          description: `${result.count} yeni haber eklendi ve onaya düştü.`,
          variant: "default",
        });
        setUrl("");
      }
    } catch (err) {
      setError("Haberler alınırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Globe className="h-5 w-5" />
          Haber Kaynağı Ekle
        </CardTitle>
        <CardDescription>
          Herhangi bir haber sitesinin URL'sini girin, yapay zeka otomatik olarak spor haberlerini bulup getirecektir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="Haber sitesi URL'sini girin (örn: https://www.example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            size="lg"
            className="min-w-[150px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Haberler Alınıyor...
              </>
            ) : (
              "Haberleri Al"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 