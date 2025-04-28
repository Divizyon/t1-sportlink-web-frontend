# Etkinlikler Sayfası Dokümantasyonu

Bu doküman, SportLink uygulamasındaki Etkinlikler sayfasının nasıl çalıştığını açıklar; sekme sistemi, API istekleri, durum yönetimi, filtreleme ve önbellek mekanizmalarını detaylandırır.

## Genel Bakış

Etkinlikler sayfası (`/dashboard/events/page.tsx`), yöneticilerin sistemdeki tüm spor etkinliklerini yönetmesine olanak tanır. Sayfa şunları içerir:

- Farklı etkinlik durumları için çoklu sekmeler (Bekleyen, Bugünkü, Gelecek, Reddedilen, Tamamlanan, Tümü)
- Arama ve filtreleme işlevselliği
- Büyük etkinlik setleri için sayfalama
- Etkinlikler için oluşturma, düzenleme ve silme işlemleri
- Her kategorideki etkinlik sayısını gösteren gerçek zamanlı durum göstergeleri

## Sekme Sistemi

### Sekme Yapısı

Sayfa, aşağıdaki sekmeleri içeren bir sekme tabanlı navigasyon sistemi kullanır:

| Sekme Adı  | Açıklama                          | Durum Eşleştirmesi | Ek Filtreler                            |
| ---------- | --------------------------------- | ------------------ | --------------------------------------- |
| Bekleyen   | Onay bekleyen etkinlikler         | `PENDING`          | Yok                                     |
| Bugünkü    | Bugün için planlanan etkinlikler  | `ACTIVE`           | `dateFilter: "today", includeAll: true` |
| Gelecek    | Gelecekteki etkinlikler           | `ACTIVE`           | `dateFilter: "upcoming"`                |
| Reddedilen | Reddedilen etkinlikler            | `REJECTED`         | Yok                                     |
| Tamamlanan | Geçmiş etkinlikler                | `COMPLETED`        | Yok                                     |
| Tümü       | Durumdan bağımsız tüm etkinlikler | Yok                | Yok                                     |

Her sekme, o kategorideki etkinliklerin sayısını gösteren bir rozet sergiler (etkinlik olmadığında "0" gösterir).

### Sekme Durum Eşleştirmesi

`TAB_TO_STATUS_MAP` nesnesi, UI sekmelerini backend durum değerleriyle eşleştirir:

```javascript
const TAB_TO_STATUS_MAP = {
  pending: "PENDING",
  today: "ACTIVE", // Özel durum, tarih filtresi gerektirir
  upcoming: "ACTIVE", // Özel durum, tarih filtresi gerektirir
  rejected: "REJECTED",
  completed: "COMPLETED",
  all: "ALL", // Tüm etkinlikleri getirir
};
```

## API İstekleri ve Veri Akışı

### İstek Akışı

1. Sayfa yüklendiğinde, her sekme için etkinlik sayısını almak üzere `fetchAllEventCounts()` fonksiyonunu çağırır
2. Ardından aktif sekmedeki etkinlikleri getirmek için `handleStatusChangeWithPagination()` fonksiyonunu çağırır
3. Kullanıcı sekme değiştirdiğinde, `handleTabChange()` tetiklenir ve bu da `handleStatusChangeWithPagination()` fonksiyonunu çağırır
4. Seçilen sekmeye bağlı olarak farklı sorgu parametreleriyle `/events` API endpoint'i kullanılır

### API İstek Parametreleri

Her sekme API'ye farklı parametreler gönderir:

- **Bekleyen sekmesi**: `status=PENDING`
- **Bugünkü sekmesi**: `status=ACTIVE&date_filter=today&includeAll=true`
- **Gelecek sekmesi**: `status=ACTIVE&date_filter=upcoming`
- **Reddedilen sekmesi**: `status=REJECTED`
- **Tamamlanan sekmesi**: `status=COMPLETED`
- **Tümü sekmesi**: Durum filtresi yok

Ek parametreler şunları içerir:

- `page`: Mevcut sayfa numarası (sayfalama için)
- `limit`: Sayfa başına öğe sayısı
- `sort_by`: Sıralama yapılacak alan (varsayılan: "created_at")
- `sort_order`: Sıralama yönü (varsayılan: "desc")

### `includeAll` Parametresi

"Bugünkü" sekmesi için, çoktan başlamış veya bitmiş olsa bile bugünün tüm etkinliklerini dahil etmek üzere `includeAll: true` değerini ayarlarız. Bu, kullanıcıların günün tüm etkinliklerini görebilmesini sağlar.

## Durum Yönetimi

Etkinlikler sayfası, çalışmasını yönetmek için birkaç durum değişkeni kullanır:

| Durum Değişkeni       | Amaç                                                |
| --------------------- | --------------------------------------------------- |
| `events`              | Mevcut etkinlik listesini saklar                    |
| `loading`             | API çağrıları sırasında yükleme durumunu takip eder |
| `activeTab`           | Şu anda seçili sekmeyi takip eder                   |
| `currentPage`         | Mevcut sayfalama sayfasını saklar                   |
| `searchQuery`         | Mevcut arama girdisini saklar                       |
| `activeFilters`       | Şu anda uygulanan filtreleri saklar                 |
| `eventCountsByStatus` | Her durumdaki etkinlik sayısını takip eder          |
| `tabLoadingStates`    | Her bir sekmenin yükleme durumunu takip eder        |

## Filtreleme ve Arama

Etkinlikler şu yollarla filtrelenebilir:

1. **Sekme Seçimi**: Etkinlik durumuna göre birincil filtreleme
2. **Arama**: Etkinlik alanları genelinde metin tabanlı filtreleme
3. **Gelişmiş Filtreler**: Şunlar gibi ek filtreleme seçenekleri:
   - Tarih aralığı
   - Spor türü
   - Konum
   - Katılımcı limitleri

`filterEventsBySearchAndFilters()` fonksiyonu, arama ve filtre kriterlerinin kombinasyonunu şunları içerecek şekilde işler:

- Etkinlik alanları genelinde büyük/küçük harf duyarsız metin araması
- Tarih aralığı filtrelemesi
- Spor filtrelemesi
- Konum filtrelemesi
- Katılımcı sayısı filtrelemesi

## Önbellek Mekanizması

Etkinlikler sayfası, performansı artırmak için bir önbellek sistemi uygular:

1. Tüm getirilen etkinlik verileri, `useEventManagement` hook'undaki `eventsCache` nesnesinde saklanır
2. Her önbellek girişi, istek parametrelerine dayalı benzersiz bir önbellek anahtarıyla ilişkilendirilir
3. Önbelleğin yapılandırılabilir bir sona erme süresi vardır (varsayılan: 60 saniye)
4. Veri getirirken, sistem önce geçerli bir önbellek girişi olup olmadığını kontrol eder
5. `isCacheValid()` fonksiyonu, önbelleğe alınmış bir sonucun kullanılıp kullanılamayacağını belirler
6. Gerektiğinde zorla yenileme önbelleği atlayabilir

Önbellek anahtarları şunlara dayanarak oluşturulur:

- Durum filtresi
- Sayfalama parametreleri
- Sıralama parametreleri
- Tarih filtresi

## Etkinlik Yönetim Fonksiyonları

Sayfa, etkinlik yönetimi için çeşitli fonksiyonlar sağlar:

| Fonksiyon                 | Amaç                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `handleUpdateEvent()`     | Bir etkinliğin detaylarını günceller                                                          |
| `handleDeleteEvent()`     | Bir etkinliği siler                                                                           |
| `handleStatusChange()`    | Bir etkinliğin durumunu değiştirir (onaylama/reddetme)                                        |
| `handleNewEventSuccess()` | Yeni bir etkinlik başarıyla oluşturulduktan sonra yenilemeyi yönetir                          |
| `isEventEditable()`       | Bir etkinliğin durumuna ve zamanlamasına bağlı olarak düzenlenebilir olup olmadığını belirler |

## Periyodik Yenileme

Sayfa, otomatik periyodik yenileme uygular:

1. Her 30 saniyede bir verileri yenilemek için bir aralık kurulur
2. Bu, etkinlik sayılarının ve durumlarının güncel kalmasını sağlar
3. Hem mevcut sekmenin verileri hem de tüm etkinlik sayıları yenilenir

## URL Senkronizasyonu

Sayfa, URL'yi seçilen sekme ve sayfayla senkronize eder:

1. Sekme veya sayfa değiştirildiğinde, URL sorgu parametreleriyle güncellenir
2. Sayfa yüklendiğinde, önceki durumu geri yüklemek için URL parametrelerini kontrol eder
3. Bu, belirli görünümlere yer işareti koymaya ve belirli sekmelere bağlantılar paylaşmaya olanak tanır

## Uygulama Notları

- Etkinlik durum değişiklikleri (onaylama/reddetme), hem mevcut sekme verilerinin hem de etkinlik sayılarının yenilenmesini tetikler
- Etkinlikler sayfası, performans optimizasyonu için memoization kullanır
- Sekme yükleme durumları, veri getirme sırasında görsel göstergeler gösterir
- Özel saat dilimi işleme, doğru tarih/zaman görüntülemeyi sağlar (İstanbul için UTC+3)

## Teknik Mimari ve Bileşen Etkileşimleri

Etkinlikler sayfası, aşağıdaki bileşenler ve etkileşimler arasında yapılandırılmıştır:

```
┌───────────────────────────────────────────────────────────┐
│                    Etkinlikler Sayfası                     │
│    (t1-sportlink-web-frontend/src/app/dashboard/events/page.tsx)   │
└───┬───────────────────────────────────────────────────────┘
    │                            ▲
    │ Kullanır                   │ Veri Sağlar
    ▼                            │
┌──────────────────────┐   ┌────┴─────────────────┐
│                      │   │                      │
│  useEventManagement  │◄──┤   API Servisi        │
│        Hook          │   │   (/events endpoint) │
│                      │   │                      │
└──────────────────────┘   └──────────────────────┘
          │                          ▲
          │ Sağlar                   │
          ▼                          │
┌──────────────────────┐             │
│                      │             │
│  Lokal Durum ve      │             │
│  Önbellek Yönetimi   │             │
│                      │             │
└──────────┬───────────┘             │
           │                         │
           │ Sorgu                   │
           │ Parametreleri           │
           │                         │
           └─────────────────────────┘
```

### Bileşen Sorumlulukları

1. **Etkinlikler Sayfası (`page.tsx`)**

   - Kullanıcı arayüzünü ve sekmeleri oluşturur
   - Kullanıcı etkileşimlerini yönetir (tab değişimleri, sayfalama, arama, filtreler)
   - `useEventManagement` hook'unu kullanarak veri ve işlevleri alır

2. **useEventManagement Hook**

   - API isteklerini yönetir
   - Önbellek mekanizmasını uygular
   - Veri dönüşümlerini ve durumunu yönetir
   - Etkinlik işlemleri için fonksiyonlar sağlar (güncelleme, silme, durum değişikliği)

3. **API Servisi**

   - REST API ile iletişim kurar
   - Kimlik doğrulama başlıklarını ekler
   - Hata işlemeyi standartlaştırır

4. **Lokal Durum ve Önbellek**
   - Etkinlikleri tip ve duruma göre gruplar
   - Önbelleğe alınmış verileri saklar
   - Gereksiz ağ isteklerini önler

### Veri Akışı

1. Sayfa yüklendiğinde, `useEffect` ile etkinlik sayıları ve aktif sekmenin verileri alınır
2. Kullanıcı sekme değiştirdiğinde:
   - Aktif sekme durumu güncellenir
   - Yeni sekmeye uygun parametrelerle `fetchEvents` çağrılır
   - Önbellek kontrol edilir ve gerekirse veri yenilenir
   - UI güncellenir (etkinlikler, sayım rozetleri)
3. Kullanıcı bir etkinlik düzenlediğinde veya sildiğinde:
   - İlgili API çağrıları yapılır
   - Önbellek temizlenir
   - Veriler yenilenir
   - UI güncellenir

Bu yapılandırma, görsel bileşenleri veri yönetiminden ayırarak daha sürdürülebilir bir kod tabanı sağlar.
