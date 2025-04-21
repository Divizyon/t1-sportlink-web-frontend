"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types/news";

// Form şeması
const formSchema = z.object({
  url: z.string().url({ message: "Geçerli bir URL girmelisiniz." }),
});

type FormValues = z.infer<typeof formSchema>;

const NewsUrlInput: React.FC = () => {
  const { toast } = useToast();
  const { addNewsFromUrl } = useNews();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // Mock haber verileri oluştur
  const generateMockNews = (): NewsItem[] => {
    const count = Math.floor(Math.random() * 5) + 1; // 1-5 arası rastgele haber sayısı
    const categoryOptions = ["Spor", "Futbol", "Basketbol", "Voleybol", "Tenis"];
    
    return Array.from({ length: count }, (_, index) => {
      const id = Date.now().toString() + index;
      const title = `Haber Başlığı ${id}`;
      const category = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
      const hasImage = Math.random() > 0.3;
      
      return {
        id,
        title,
        content: `Bu ${category} ile ilgili bir haber içeriğidir. Bu içerik otomatik olarak oluşturulmuştur.`,
        category,
        image: hasImage ? `https://picsum.photos/seed/${id}/800/400` : undefined,
        publishDate: new Date().toISOString(),
        tags: ["spor", category.toLowerCase()],
        status: "pending" as "pending" | "approved" | "rejected",
        hasImage,
        contentLength: Math.floor(Math.random() * 500) + 100,
        imageStatus: 'available' as 'available' | 'error' | 'loading',
        sourceUrl: "",
        selected: false,
        showDetails: false
      };
    });
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Mock veriler ile işlem yapalım
      const mockNews = generateMockNews();
      
      // URL'den haberleri ekle (burada mock verileri kullanıyoruz)
      const result = await addNewsFromUrl(mockNews, values.url);
      
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: `${result.count} haber başarıyla eklendi.`,
        });
        
        // Formu sıfırla
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Haberler alınırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6 bg-card rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Haber URL'si</h2>
      <p className="text-muted-foreground">
        Haberleri almak istediğiniz kaynağın URL'sini girin.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Haber URL'si</FormLabel>
                <FormControl>
                  <Input placeholder="https://spor-haber-kaynagi.com/haberler" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Haberler Alınıyor..." : "Haberleri Al"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsUrlInput; 