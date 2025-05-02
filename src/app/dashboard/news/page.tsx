"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNews } from "@/hooks/useNews";
import { NewsTable } from "@/components/news/NewsTable";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  RssIcon,
  GlobeIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  EditIcon,
  RefreshCwIcon,
  FilterIcon,
  CheckSquareIcon,
  Pencil,
  Link,
  Calendar,
  Trash2Icon,
  CalendarIcon,
  BellIcon,
  Edit,
  MoreVertical,
  PlusIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewsItem } from "@/types/news";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import NewsUrlInput from "@/components/news/NewsUrlInput";
import { AnnouncementModal } from "@/components/modals/AnnouncementModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnnouncementCard } from "@/components/cards/AnnouncementCard";

export default function NewsPage() {
  const {
    news,
    filteredNews,
    loading,
    filters,
    setFilters,
    pendingCount,
    setNews,
    approveNews,
    rejectNews,
    deleteNews,
    updateNews,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    loadNewsNow,
  } = useNews();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const newsUrlInputRef = useRef<HTMLFormElement>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track if component has been initialized
  const isInitialized = useRef(false);
  const forceLoadComplete = useRef(false);
  const [isPageInitialized, setIsPageInitialized] = useState(false);

  // Force reset loading state if stuck for more than 5 seconds
  useEffect(() => {
    if (loading && !forceLoadComplete.current) {
      const timer = setTimeout(() => {
        forceLoadComplete.current = true;

        // Explicitly load news for the selected tab
        const targetStatus =
          activeTab === "approved"
            ? "approved"
            : activeTab === "rejected"
            ? "rejected"
            : "pending";

        // Force immediate load with explicit API call
        loadNewsNow(targetStatus);
      }, 5000); // Increased from 3000 to 5000ms for more reliability

      return () => clearTimeout(timer);
    } else if (!loading) {
      // Reset force load flag when loading completes naturally
      forceLoadComplete.current = false;
    }
  }, [loading, activeTab, loadNewsNow]);

  // Component initialization - only runs once
  useEffect(() => {
    // If already initialized, skip
    if (isInitialized.current) return;

    // Set initialization flag
    isInitialized.current = true;

    // Initialize with pending tab
    const initialTab = "pending";
    setActiveTab(initialTab);

    // Force an immediate load with a slight delay to ensure component is fully mounted
    setTimeout(() => {
      loadNewsNow(initialTab);
      // Mark page as initialized after first load
      setIsPageInitialized(true);
    }, 200);
  }, [loadNewsNow]);

  // Handle tab changes
  const handleTabChange = useCallback(
    (newTab: string) => {
      // Skip if tab hasn't actually changed
      if (newTab === activeTab) return;

      // Update the active tab
      setActiveTab(newTab);

      // Reset selection when switching tabs
      setSelectedIds([]);

      // Map tab to status
      const newStatus =
        newTab === "approved"
          ? "approved"
          : newTab === "rejected"
          ? "rejected"
          : "pending";

      // Force load with the new status - more reliable than relying on filter changes
      loadNewsNow(newStatus);
    },
    [activeTab, loadNewsNow, setSelectedIds]
  );

  // Onay bekleyen haber sayısını takip et
  useEffect(() => {
    if (pendingCount > 0) {
      toast({
        title: "Yeni Onay Bekleyen Haberler",
        description: `${pendingCount} haber onay bekliyor.`,
        variant: "default",
      });
    }
  }, [pendingCount, toast]);

  // URL girişi sonrası otomatik olarak onay bekleyenler sekmesine geçiş yapar
  const handleNewsAdded = () => {
    handleTabChange("pending");
  };

  // Debug effect to log news data when it changes
  useEffect(() => {
    console.log(`News data updated for status (${filters.status}):`, {
      count: filteredNews.length,
      totalInPagination: pagination.total,
      firstItem: filteredNews[0] ? filteredNews[0].title : "none",
    });
  }, [filteredNews, filters.status, pagination.total]);

  // Haberi onaylama fonksiyonu - sekme değişimi olmadan
  const handleApproveNews = async (id: string) => {
    try {
      const result = await approveNews(id);

      if (result.success) {
        // Başarılı haber onaylandığında daha belirgin bir bildirim göster
        toast({
          title: "✅ Haber Başarıyla Onaylandı",
          description:
            "Haber onaylandı ve yayına alındı. Onaylanmış haberleri görmek için üstteki sekmeleri kullanabilirsiniz.",
          variant: "success",
        });

        // Sonner toast bildirimi ekle - daha göze çarpan bir bildirim
        sonnerToast.success("Haber Onaylandı", {
          description: "Haber başarıyla onaylandı ve yayına alındı.",
          position: "top-right",
          duration: 4000,
          icon: "✅",
        });

        // Sekme değişimi yapılmayacak
      } else {
        toast({
          title: "Haber Onaylanamadı",
          description: "Haber onaylanırken bir hata oluştu.",
          variant: "destructive",
        });

        sonnerToast.error("Haber Onaylanamadı", {
          description: "Haber onaylanırken bir hata oluştu.",
          position: "top-right",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Haber Onaylanamadı",
        description: "Haber onaylanırken bir hata oluştu.",
        variant: "destructive",
      });

      sonnerToast.error("Haber Onaylanamadı", {
        description: "Haber onaylanırken bir hata oluştu.",
        position: "top-right",
        duration: 4000,
      });
    }
  };

  // Haberi silme fonksiyonu
  const handleDeleteNews = async (id: string) => {
    try {
      deleteNews(id);
      // Başarılı silme işlemi için daha belirgin bildirim
      toast({
        title: "🗑️ Haber Silindi",
        description: "Haber başarıyla silindi ve listeden kaldırıldı.",
        variant: "info",
      });

      // Sonner toast bildirimi
      sonnerToast.info("Haber Silindi", {
        description: "Haber başarıyla silindi ve listeden kaldırıldı.",
        position: "top-right",
        duration: 4000,
        icon: "🗑️",
      });
    } catch (error) {
      toast({
        title: "Haber Silinemedi",
        description: "Haber silinirken bir hata oluştu.",
        variant: "destructive",
      });

      sonnerToast.error("Haber Silinemedi", {
        description: "Haber silinirken bir hata oluştu.",
        position: "top-right",
        duration: 4000,
      });
    }
  };

  // Seçili haberleri onaylama fonksiyonu - sekme değişimi olmadan
  const handleApproveSelected = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Seçim Yapılmadı",
        description: "Lütfen önce onaylanacak haberleri seçin.",
        variant: "destructive",
      });

      sonnerToast.error("Seçim Yapılmadı", {
        description: "Lütfen önce onaylanacak haberleri seçin.",
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Her bir seçili haber için onaylama işlemi yap
      let approvedCount = 0;
      const promises = [];

      for (const id of selectedIds) {
        const promise = approveNews(id)
          .then((result) => {
            if (result.success) {
              approvedCount++;
            }
          })
          .catch((error) => {
            console.error(`${id} ID'li haber onaylanırken hata oluştu:`, error);
          });

        promises.push(promise);
      }

      // Tüm onaylama işlemlerinin tamamlanmasını bekle
      await Promise.all(promises);

      // Temizlik ve bildirim
      setSelectedIds([]);
      toast({
        title: `✅ ${approvedCount} Haber Onaylandı`,
        description: `Seçilen haberler başarıyla onaylandı ve yayına alındı. Onaylanmış haberleri görmek için üstteki "Onaylanmış Haberler" sekmesine geçebilirsiniz.`,
        variant: "success",
      });

      // Sonner toast bildirimi
      sonnerToast.success(`${approvedCount} Haber Onaylandı`, {
        description: "Seçilen haberler başarıyla onaylandı ve yayına alındı.",
        position: "top-right",
        duration: 4000,
        icon: "✅",
      });

      // Sekme değişimi yapmıyoruz
    } catch (error) {
      toast({
        title: "Hata",
        description: "Toplu onaylama işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });

      sonnerToast.error("Toplu Onaylama Hatası", {
        description: "Toplu onaylama işlemi sırasında bir hata oluştu.",
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Haberi düzenleme fonksiyonu
  const handleEditNews = (id: string) => {
    toast({
      title: "Düzenleme Modu",
      description: `${id} ID'li haber düzenleniyor...`,
      variant: "default",
    });
    // Burada düzenleme mantığı eklenecek
  };

  // Haber seçimi işlemleri
  const toggleSelectNews = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Tüm haberleri seç/kaldır
  const toggleSelectAll = (pendingNews: NewsItem[]) => {
    if (selectedIds.length === pendingNews.length) {
      // Tüm seçimleri kaldır
      setSelectedIds([]);
    } else {
      // Tümünü seç
      setSelectedIds(pendingNews.map((item) => item.id));
    }
  };

  // URL'den haberleri çekmek için fonksiyon
  const fetchNewsFromUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL gerekli",
        description: "Lütfen bir haber sitesi URL'si girin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // URL'yi doğrula
      let validUrl;
      try {
        validUrl = new URL(url);
        if (!validUrl.protocol.startsWith("http")) {
          throw new Error("Geçersiz protokol");
        }
      } catch {
        throw new Error(
          "Lütfen geçerli bir URL girin (örn: https://www.example.com)"
        );
      }

      // Toast bildirimi göster
      toast({
        title: "Haberler Çekiliyor",
        description: "URL'den haberler alınıyor, lütfen bekleyin...",
        variant: "default",
      });

      // Backend bağlantısı simüle ediliyor
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Domain adını al ve mock haber başlıklarında kullan
      const domain = validUrl.hostname.replace("www.", "");

      // Mock haberler oluştur
      const newsCount = Math.floor(Math.random() * 5) + 5; // 5-9 arası haber
      const newsItems: NewsItem[] = [];

      const categories = [
        "Futbol",
        "Basketbol",
        "Voleybol",
        "Formula 1",
        "Tenis",
        "Motorsporları",
        "Güreş",
      ];
      const tags = [
        "Süper Lig",
        "Şampiyonlar Ligi",
        "Transfer",
        "Milli Takım",
        "Avrupa Kupası",
        "Galibiyet",
        "Maç Sonucu",
      ];

      const titles = [
        `${domain} - Süper Lig'de haftanın maç sonuçları`,
        `Fenerbahçe'den son dakika transfer hamlesi`,
        `Galatasaray'da teknik direktör krizi!`,
        `${domain}: Beşiktaş'ın yeni transferi imzayı attı`,
        `A Milli Takım'ın aday kadrosu açıklandı`,
        `${domain}: Avrupa kupalarında Türk takımlarının fikstürü belli oldu`,
        `Şampiyonlar Ligi'nde dev eşleşmeler!`,
        `${domain}'dan bomba iddia: Yıldız oyuncu Türkiye'ye geliyor`,
        `Formula 1'de sezonun son yarışı heyecanı`,
        `${domain}: Basketbol Süper Ligi'nde şampiyonluk favorileri`,
      ];

      const contents = [
        `Süper Lig'de bu hafta oynanan karşılaşmalarda sonuçlar belli oldu. Lider takım deplasmanda kazanarak puanını 45'e yükseltti. Takipçisi ise evinde berabere kalarak puan kaybetti. Kümede kalma mücadelesi veren ekipler arasındaki zorlu mücadelede kazanan çıkmadı.`,

        `Kulüpten yapılan açıklamaya göre, dünyaca ünlü yıldız ile prensip anlaşmasına varıldı. Oyuncu, yarın İstanbul'a gelerek sağlık kontrolünden geçecek ve resmi sözleşmeyi imzalayacak. Transfer ücreti ise 15 milyon euro olarak açıklandı.`,

        `Son maçta alınan kötü sonuçların ardından teknik direktör ile yollar ayrıldı. Kulüp başkanı yarın yapacağı basın toplantısında yeni teknik direktörü açıklayacak. İddiaya göre, Avrupa'nın önde gelen takımlarında görev yapmış deneyimli bir isimle anlaşmaya varıldı.`,

        `Tecrübeli orta saha oyuncusu, dün akşam İstanbul'a geldi ve bu sabah sağlık kontrolünden geçti. 3 yıllık imzayı atan oyuncu, "Kariyerimin en doğru kararını verdim. Bu forma altında şampiyonluklar yaşamak istiyorum" dedi. Transferin maliyeti açıklanmazken, bonservis bedelinin 7 milyon euro olduğu tahmin ediliyor.`,

        `Milli takımlar teknik direktörü, önümüzdeki ay oynanacak önemli maçlar için 26 kişilik aday kadroyu duyurdu. Kadroda 3 yeni isim dikkat çekerken, sakatlığı süren yıldız oyuncu kadroya dahil edilmedi. Tecrübeli teknik adam, "Hedefimiz gruptan lider çıkmak" dedi.`,
      ];

      // Spor haberleri için örnek fotoğraf URL'leri
      const sampleImages = [
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800", // Futbol stadyumu
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800", // Basketbol
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800", // Voleybol
        "https://images.unsplash.com/photo-1541773367336-d3f7e6a22d45?q=80&w=800", // Formula 1
        "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?q=80&w=800", // Tenis
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800", // Stadyum
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800", // Spor salonu
        "https://images.unsplash.com/photo-1629285483773-6b5cde2171d1?q=80&w=800", // Futbol antrenman
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800", // Basketbol sahası
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800", // Spor ekipmanları
      ];

      // Her bir haber için rasgele içerik oluştur
      for (let i = 0; i < newsCount; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomContent =
          contents[Math.floor(Math.random() * contents.length)];
        const randomCategory =
          categories[Math.floor(Math.random() * categories.length)];
        const randomImage =
          sampleImages[Math.floor(Math.random() * sampleImages.length)];

        // Rasgele 1-3 etiket seç
        const randomTags: string[] = [];
        const tagCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < tagCount; j++) {
          const randomTag = tags[Math.floor(Math.random() * tags.length)];
          if (!randomTags.includes(randomTag)) {
            randomTags.push(randomTag);
          }
        }

        // Rastgele bir tarih oluştur (son 7 gün içinde)
        const randomDate = new Date();
        randomDate.setDate(
          randomDate.getDate() - Math.floor(Math.random() * 7)
        );

        newsItems.push({
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          title: randomTitle,
          content: randomContent,
          category: randomCategory,
          image: randomImage,
          publishDate: randomDate.toISOString(),
          tags: randomTags,
          status: "pending",
          type: "news",
          hasImage: true,
          contentLength: randomContent.length,
          imageStatus: "available",
          sendNotification: false,
        });
      }

      // Haberleri state'e ekle
      setNews((prev: NewsItem[]) => [...prev, ...newsItems]);

      // Onay bekleyen sekmeye geç
      handleNewsAdded();
      setUrl("");

      toast({
        title: "Haberler Başarıyla Alındı",
        description: `${newsItems.length} yeni haber eklendi ve onaya düştü.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Haber Eklenemedi",
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
        variant: "destructive",
      });
      console.error("Haber çekme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Habere tıklandığında detay sayfasına yönlendir
  const handleNewsClick = (id: string) => {
    // Seçilen haberin durumunu değiştirerek detay göstermeyi toggle et
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.id === id ? { ...item, showDetails: !item.showDetails } : item
      )
    );

    // Kullanıcıya bildirim göster
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      toast({
        title: newsItem.showDetails
          ? "Detaylar Gizlendi"
          : "Detaylar Gösteriliyor",
        description: `"${newsItem.title.substring(0, 40)}${
          newsItem.title.length > 40 ? "..." : ""
        }" için detaylar ${
          newsItem.showDetails ? "gizlendi" : "gösteriliyor"
        }.`,
        variant: "info",
      });

      // Sonner toast bildirimi - Ayrı bir bildirim olarak eklemek yerine güncelledim
      if (!newsItem.showDetails) {
        sonnerToast.info("Haber Detayları", {
          description: `"${newsItem.title.substring(0, 40)}${
            newsItem.title.length > 40 ? "..." : ""
          }" için detaylar genişletildi.`,
          position: "bottom-right",
          duration: 3000,
          icon: "ℹ️",
        });
      }
    }
  };

  // Duyuruları filtrele
  const announcements = news.filter(
    (item) => item.type === "announcement" && item.status === "approved"
  );
  const pendingNews = news.filter(
    (item) => item.type === "news" && item.status === "pending"
  );
  const approvedNews = news.filter(
    (item) => item.type === "news" && item.status === "approved"
  );

  // Duyuru düzenleme modalını aç
  const handleEditAnnouncement = (announcement: NewsItem) => {
    console.log("Düzenleme modalı açılıyor:", announcement);
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  // Duyuruyu güncelle
  const handleUpdateAnnouncement = (updatedAnnouncement: NewsItem) => {
    try {
      updateNews(updatedAnnouncement);
      toast({
        title: "Başarılı",
        description: "Duyuru başarıyla güncellendi",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Duyuru güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Duyuruyu sil
  const handleDeleteAnnouncement = (id: string) => {
    try {
      deleteNews(id);
      toast({
        title: "Başarılı",
        description: "Duyuru başarıyla silindi",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Duyuru silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Haberler ve Duyurular
        </h1>
        <Button
          onClick={() =>
            handleEditAnnouncement({
              id: Date.now().toString(),
              title: "",
              content: "",
              category: "Genel",
              type: "announcement",
              status: "approved",
              publishDate: new Date().toISOString(),
              tags: [],
              hasImage: false,
              contentLength: 0,
              imageStatus: "error",
              sendNotification: false,
            })
          }
          size="sm"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          İçerik Yayınla
        </Button>
      </div>

      {/* URL Girişi */}
      <Card className="mb-4">
        <CardHeader className="pb-2 px-3">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <GlobeIcon className="h-4 w-4 mr-2 text-primary" />
            Haber Sitesi URL'si Girin
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Haber kaynağı URL'sini girerek haberleri otomatik olarak sisteme
            ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="https://www.sporhaberleri.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 text-sm"
            />
            <Button
              onClick={fetchNewsFromUrl}
              disabled={isLoading || !url.trim()}
              className="whitespace-nowrap text-xs sm:text-sm"
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCwIcon className="mr-1 h-3 w-3 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  Haberleri Çek
                  <ArrowRightIcon className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full max-w-full overflow-hidden"
      >
        <TabsList className="w-full flex justify-between">
          <TabsTrigger
            value="announcements"
            className="text-xs sm:text-sm flex-1"
          >
            Duyurular
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm flex-1">
            Onay Bekleyenler
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs sm:text-sm flex-1">
            Onaylananlar
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs sm:text-sm flex-1">
            Reddedilenler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              onEdit={() => handleEditAnnouncement(item)}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
              <div>
                <CardTitle className="text-base">
                  Onay Bekleyen Haberler
                </CardTitle>
                <CardDescription className="text-xs">
                  Onayınızı bekleyen haberler burada listelenir.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApproveSelected}
                  disabled={loading || isLoading || selectedIds.length === 0}
                  className="flex items-center gap-1 text-xs"
                  size="sm"
                >
                  <CheckIcon className="h-3 w-3" />
                  <span>Seçilenleri Onayla</span>
                  {isLoading && (
                    <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <NewsTable
                news={filteredNews}
                loading={loading}
                showActions={true}
                showSelect={true}
                totalCount={pagination.total}
                currentPage={pagination.page}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-3 pb-2">
              <CardTitle className="text-base">Onaylanmış Haberler</CardTitle>
              <CardDescription className="text-xs">
                Onaylanmış ve yayınlanmış haberler burada listelenir.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <NewsTable
                news={filteredNews}
                loading={loading}
                showActions={false}
                showSelect={false}
                totalCount={pagination.total}
                currentPage={pagination.page}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
              <div>
                <CardTitle className="text-base">Reddedilen Haberler</CardTitle>
                <CardDescription className="text-xs">
                  Reddedilmiş haberler burada listelenir.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <NewsTable
                news={filteredNews}
                loading={loading}
                showActions={true}
                showSelect={false}
                totalCount={pagination.total}
                currentPage={pagination.page}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AnnouncementModal
        announcement={selectedAnnouncement}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnnouncement(null);
        }}
        onSave={handleUpdateAnnouncement}
        onDelete={handleDeleteAnnouncement}
      />
    </div>
  );
}
