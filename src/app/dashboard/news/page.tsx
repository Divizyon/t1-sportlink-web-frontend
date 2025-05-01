"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNews } from "@/hooks/useNews";
import { NewsTable } from "@/components/news/NewsTable";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  RssIcon, GlobeIcon, ArrowRightIcon, CheckIcon, XIcon, EditIcon, 
  RefreshCwIcon, FilterIcon, CheckSquareIcon, Pencil, Link, Calendar, Trash2Icon, CalendarIcon, BellIcon, Edit, MoreVertical, PlusIcon 
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
  const { news, filteredNews, loading, filters, setFilters, pendingCount, setNews, approveNews, rejectNews, deleteNews, updateNews } = useNews();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("announcements");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const newsUrlInputRef = useRef<HTMLFormElement>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setActiveTab("pending");
  };

  // Tab değişikliğini izle
  useEffect(() => {
    console.log("Aktif tab:", activeTab);
  }, [activeTab]);

  // Haberi onaylama fonksiyonu - sekme değişimi olmadan
  const handleApproveNews = async (id: string) => {
    try {
      const result = await approveNews(id);
      
      if (result.success) {
        // Başarılı haber onaylandığında daha belirgin bir bildirim göster
        toast({
          title: "✅ Haber Başarıyla Onaylandı",
          description: "Haber onaylandı ve yayına alındı. Onaylanmış haberleri görmek için üstteki sekmeleri kullanabilirsiniz.",
          variant: "success",
        });

        // Sonner toast bildirimi ekle - daha göze çarpan bir bildirim
        sonnerToast.success("Haber Onaylandı", {
          description: "Haber başarıyla onaylandı ve yayına alındı.",
          position: "top-right",
          duration: 4000,
          icon: "✅"
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
        icon: "🗑️"
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
          .then(result => {
            if (result.success) {
              approvedCount++;
            }
          })
          .catch(error => {
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
        icon: "✅"
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
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  // Tüm haberleri seç/kaldır
  const toggleSelectAll = (pendingNews: NewsItem[]) => {
    if (selectedIds.length === pendingNews.length) {
      // Tüm seçimleri kaldır
      setSelectedIds([]);
    } else {
      // Tümünü seç
      setSelectedIds(pendingNews.map(item => item.id));
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
        if (!validUrl.protocol.startsWith('http')) {
          throw new Error('Geçersiz protokol');
        }
      } catch {
        throw new Error("Lütfen geçerli bir URL girin (örn: https://www.example.com)");
      }

      // Toast bildirimi göster
      toast({
        title: "Haberler Çekiliyor",
        description: "URL'den haberler alınıyor, lütfen bekleyin...",
        variant: "default",
      });

      // Backend bağlantısı simüle ediliyor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Domain adını al ve mock haber başlıklarında kullan
      const domain = validUrl.hostname.replace('www.', '');
      
      // Mock haberler oluştur
      const newsCount = Math.floor(Math.random() * 5) + 5; // 5-9 arası haber
      const newsItems: NewsItem[] = [];
      
      const categories = ["Futbol", "Basketbol", "Voleybol", "Formula 1", "Tenis", "Motorsporları", "Güreş"];
      const tags = ["Süper Lig", "Şampiyonlar Ligi", "Transfer", "Milli Takım", "Avrupa Kupası", "Galibiyet", "Maç Sonucu"];
      
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
        `${domain}: Basketbol Süper Ligi'nde şampiyonluk favorileri`
      ];
      
      const contents = [
        `Süper Lig'de bu hafta oynanan karşılaşmalarda sonuçlar belli oldu. Lider takım deplasmanda kazanarak puanını 45'e yükseltti. Takipçisi ise evinde berabere kalarak puan kaybetti. Kümede kalma mücadelesi veren ekipler arasındaki zorlu mücadelede kazanan çıkmadı.`,
        
        `Kulüpten yapılan açıklamaya göre, dünyaca ünlü yıldız ile prensip anlaşmasına varıldı. Oyuncu, yarın İstanbul'a gelerek sağlık kontrolünden geçecek ve resmi sözleşmeyi imzalayacak. Transfer ücreti ise 15 milyon euro olarak açıklandı.`,
        
        `Son maçta alınan kötü sonuçların ardından teknik direktör ile yollar ayrıldı. Kulüp başkanı yarın yapacağı basın toplantısında yeni teknik direktörü açıklayacak. İddiaya göre, Avrupa'nın önde gelen takımlarında görev yapmış deneyimli bir isimle anlaşmaya varıldı.`,
        
        `Tecrübeli orta saha oyuncusu, dün akşam İstanbul'a geldi ve bu sabah sağlık kontrolünden geçti. 3 yıllık imzayı atan oyuncu, "Kariyerimin en doğru kararını verdim. Bu forma altında şampiyonluklar yaşamak istiyorum" dedi. Transferin maliyeti açıklanmazken, bonservis bedelinin 7 milyon euro olduğu tahmin ediliyor.`,
        
        `Milli takımlar teknik direktörü, önümüzdeki ay oynanacak önemli maçlar için 26 kişilik aday kadroyu duyurdu. Kadroda 3 yeni isim dikkat çekerken, sakatlığı süren yıldız oyuncu kadroya dahil edilmedi. Tecrübeli teknik adam, "Hedefimiz gruptan lider çıkmak" dedi.`
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
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800"  // Spor ekipmanları
      ];

      // Her bir haber için rasgele içerik oluştur
      for (let i = 0; i < newsCount; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomContent = contents[Math.floor(Math.random() * contents.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        
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
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));
        
        newsItems.push({
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          title: randomTitle,
          content: randomContent,
          category: randomCategory,
          image: randomImage,
          date: randomDate.toISOString(),
          tags: randomTags,
          status: "pending",
          type: "news",
          hasImage: true,
          sendNotification: false
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
    setNews(prevNews => 
      prevNews.map(item => 
        item.id === id 
          ? { ...item, showDetails: !item.showDetails } 
          : item
      )
    );
    
    // Kullanıcıya bildirim göster
    const newsItem = news.find(item => item.id === id);
    if (newsItem) {
      toast({
        title: newsItem.showDetails ? "Detaylar Gizlendi" : "Detaylar Gösteriliyor",
        description: `"${newsItem.title.substring(0, 40)}${newsItem.title.length > 40 ? '...' : ''}" için detaylar ${newsItem.showDetails ? 'gizlendi' : 'gösteriliyor'}.`,
        variant: "info",
      });

      // Sonner toast bildirimi - Ayrı bir bildirim olarak eklemek yerine güncelledim
      if (!newsItem.showDetails) {
        sonnerToast.info("Haber Detayları", {
          description: `"${newsItem.title.substring(0, 40)}${newsItem.title.length > 40 ? '...' : ''}" için detaylar genişletildi.`,
          position: "bottom-right",
          duration: 3000,
          icon: "ℹ️"
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
      toast("Duyuru başarıyla güncellendi");
    } catch (error) {
      toast("Duyuru güncellenirken bir hata oluştu");
                }
  };

  // Duyuruyu sil
  const handleDeleteAnnouncement = (id: string) => {
                  try {
                    deleteNews(id);
      toast("Duyuru başarıyla silindi");
                  } catch (error) {
      toast("Duyuru silinirken bir hata oluştu");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Haberler ve Duyurular</h1>
        <Button onClick={() => handleEditAnnouncement({
          id: Date.now().toString(),
          title: "",
          content: "",
          type: "announcement",
          status: "approved",
          date: new Date().toISOString(),
          sendNotification: false,
          tags: [],
          hasImage: false,
        })}>
          <PlusIcon className="mr-2 h-4 w-4" />
          İçerik Yayınla
        </Button>
      </div>

        {/* URL Girişi */}
      <Card className="mb-6">
        <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <GlobeIcon className="h-5 w-5 mr-2 text-primary" />
              Haber Sitesi URL'si Girin
            </CardTitle>
            <CardDescription>
              Haber kaynağı URL'sini girerek haberleri otomatik olarak sisteme ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://www.sporhaberleri.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              />
              <Button 
                onClick={fetchNewsFromUrl}
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <>
                    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    Haberleri Çek
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="announcements">Duyurular</TabsTrigger>
          <TabsTrigger value="pending">
                  Onay Bekleyenler
                  {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
          <TabsTrigger value="approved">Onaylananlar</TabsTrigger>
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
          {selectedIds.length > 0 && (
            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-4">
              <span>{selectedIds.length} haber seçildi</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApproveSelected}
                  disabled={isLoading}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Seçilenleri Onayla
                </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                  onClick={() => {
                    selectedIds.forEach(id => handleDeleteNews(id));
                    setSelectedIds([]);
                  }}
                  disabled={isLoading}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Seçilenleri Sil
                        </Button>
                      </div>
                    </div>
          )}
          {pendingNews.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onCheckedChange={() => toggleSelectNews(item.id)}
              />
              {item.hasImage && item.image && (
                <div className="w-[120px] h-[80px] relative overflow-hidden rounded">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "https://via.placeholder.com/120x80?text=Görsel+Yok";
                                }}
                              />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                            )}
                          </div>
              <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                  onClick={() => handleApproveNews(item.id)}
                            >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Onayla
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteNews(item.id)}
                            >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                              Sil
                            </Button>
                          </div>
                        </div>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedNews.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNews(item.id)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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