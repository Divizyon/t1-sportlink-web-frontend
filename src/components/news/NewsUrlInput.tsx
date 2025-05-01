"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useNews } from "@/hooks/useNews";
import { NewsItem } from "@/types/news";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS_CATEGORIES, getSportCategories } from "@/services/newsService";

// Form şeması
const formSchema = z.object({
  url: z.string().url({ message: "Geçerli bir URL girmelisiniz." }),
  sportId: z.string({ required_error: "Spor kategorisi seçmelisiniz." }),
});

type FormValues = z.infer<typeof formSchema>;

interface SportCategory {
  id: number;
  name: string;
  icon?: string;
}

const NewsUrlInput: React.FC = () => {
  const { toast } = useToast();
  const { addNewsFromUrl } = useNews();
  const [isLoading, setIsLoading] = useState(false);
  const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch sport categories on component mount
  useEffect(() => {
    const fetchSportCategories = async () => {
      try {
        const response = await getSportCategories();
        if (response.status === "success" && response.data) {
          setSportCategories(response.data);
        } else {
          console.error("Failed to load sport categories:", response);
        }
      } catch (error) {
        console.error("Error loading sport categories:", error);
        toast({
          title: "Hata",
          description: "Spor kategorileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchSportCategories();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      sportId:
        sportCategories.length > 0
          ? sportCategories[0].id.toString()
          : SPORTS_CATEGORIES.FOOTBALL.toString(),
    },
  });

  // Update form default value when categories load
  useEffect(() => {
    if (sportCategories.length > 0) {
      form.setValue("sportId", sportCategories[0].id.toString());
    }
  }, [sportCategories, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const sportId = parseInt(values.sportId);

      // URL'den haberleri ekle ve seçilen spor kategorisini gönder
      const result = await addNewsFromUrl([], values.url, sportId);

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
        form.reset({
          url: "",
          sportId: values.sportId, // Spor kategorisini koru
        });
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
        Haberleri almak istediğiniz kaynağın URL'sini girin ve spor kategorisini
        seçin.
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
                  <Input
                    placeholder="https://spor-haber-kaynagi.com/haberler"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spor Kategorisi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? "Yükleniyor..."
                            : "Spor kategorisi seçin"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sportCategories.length > 0 ? (
                      sportCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.icon && (
                            <span className="mr-2">{category.icon}</span>
                          )}
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      // Fallback to hardcoded categories if API fails
                      <>
                        <SelectItem
                          value={SPORTS_CATEGORIES.FOOTBALL.toString()}
                        >
                          Futbol
                        </SelectItem>
                        <SelectItem
                          value={SPORTS_CATEGORIES.BASKETBALL.toString()}
                        >
                          Basketbol
                        </SelectItem>
                        <SelectItem
                          value={SPORTS_CATEGORIES.VOLLEYBALL.toString()}
                        >
                          Voleybol
                        </SelectItem>
                        <SelectItem value={SPORTS_CATEGORIES.TENNIS.toString()}>
                          Tenis
                        </SelectItem>
                        <SelectItem
                          value={SPORTS_CATEGORIES.SWIMMING.toString()}
                        >
                          Yüzme
                        </SelectItem>
                        <SelectItem value={SPORTS_CATEGORIES.OTHER.toString()}>
                          Diğer
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isLoadingCategories}
          >
            {isLoading ? "Haberler Alınıyor..." : "Haberleri Al"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewsUrlInput;
