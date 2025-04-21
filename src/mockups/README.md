# Mockups Dizini

Bu dizin, bileşenlerde kullanılan tüm mockup verilerinin merkezi konumudur. Yapı şu amaçlarla tasarlanmıştır:

1. Bileşenlerin kullandığı veri tiplerini belgelemek
2. Backend geliştiricileri için net bir arayüz sağlamak
3. Uygulama genelinde veri yapısında tutarlılık sağlamak

## Migrasyon Tamamlandı ✅

> **@/mocks'tan @/mockups'a migrasyon tamamlandı!**
>
> Tüm bileşenler yeni mockup yapısını kullanacak şekilde güncellendi.
> Eski @/mocks dizini kullanımdan kaldırıldı ve gelecek bir güncellemede tamamen kaldırılacak.
>
> Detaylı migrasyon belgeleri için [migration](./migration/) dizinine, özellikle [PHASE5_DOCUMENTATION.md](./migration/PHASE5_DOCUMENTATION.md) dosyasına bakabilirsiniz.

## Veri Yönetim Mimarisi: Types, Constants ve Mockups

Projemizde veri yönetimi üç ana bileşene ayrılmıştır. Her biri spesifik bir amaca hizmet eder ve bu ayrım, backend entegrasyonunu kolaylaştıracaktır:

### 1. Types `/src/types`

**Amacı**: Uygulama genelinde kullanılan tüm veri tipi tanımlarını içerir.

- **İçerik**: TypeScript type, interface ve enum tanımları
- **Kullanım**: Hem frontend hem de backend arasındaki veri yapılarını tanımlamak için
- **Özellik**: Backend API'den gelen verinin nasıl şekillendirildiğini belirler
- **Örnek**: `Event`, `User`, `Report` interface tanımları

### 2. Mockups `/src/mockups`

**Amacı**: Backend API'lerden gelecek olan gerçek veriyi simüle eder.

- **İçerik**: JSON benzeri veri yapıları ve schema tanımları
- **Kullanım**: Bileşenlerde gösterilecek dinamik veriler için
- **Özellik**: API yanıtlarını taklit eden veriler; kategori listeleri, durum seçenekleri vb.
- **Örnek**: `EVENT_SCHEMA`, `USER_SCHEMA`, event kategorileri, rapor durumları

### 3. Constants `/src/constants`

**Amacı**: Uygulama davranışını kontrol eden gerçek sabitleri tanımlar.

- **İçerik**: Zamanlar, yollar, ayarlar, piktogramik değerler
- **Kullanım**: Uygulama çalışma zamanı davranışları için
- **Özellik**: API yanıtlarıyla değişmeyen, gerçek "sabit" değerler
- **Örnek**: `API_TIMEOUT`, `LOADING_DELAY`, `DATE_FORMAT`, `UI_CONFIG`

## Doğru Veri Kaynağı Kullanımı

### ✅ Doğru Kullanım:

- **Types**: Tip güvenliği ve API sözleşmeleri için

  ```typescript
  function handleEvent(event: Event) {
    /* ... */
  }
  ```

- **Mockups**: Bileşenlerin göstereceği dinamik veriler için

  ```typescript
  // ✅ Görüntülenecek veriler için mockup kullanımı
  import { EVENT_CATEGORIES } from "@/mockups";
  ```

- **Constants**: Uygulama yapılandırması için
  ```typescript
  // ✅ Uygulama davranışını kontrol eden gerçek sabitler
  import { API_TIMEOUT, DATE_FORMAT } from "@/constants";
  ```

### ❌ Hatalı Kullanım:

- **Bileşenlerde Hardcoded Data**

  ```typescript
  // ❌ Hardcoded veri listeleri
  const categories = ["training", "tournament", "social"];
  ```

- **Constants İçerisinde API Verileri**

  ```typescript
  // ❌ Aslında API'den gelmesi gereken liste/seçenekler
  export const EVENT_CATEGORIES = {
    /* ... */
  }; // Bu mockups içinde olmalı
  ```

- **Karışık Sorumluluklar**
  ```typescript
  // ❌ Types, mockups ve constants karışımı
  export const EVENT_TYPES: EventType[] = ["training", "social"]; // Karmaşık sorumluluk
  ```

## Backend Entegrasyonu İçin Beklenen API Yanıtları

Her mockup şeması, backend API'den beklediğimiz yanıt yapısını temsil eder. Backend geliştiriciler, aşağıdaki şemalara uygun API yanıtları üretmelidir:

### Temel Şemalar

1. **Event API**

   - Base Endpoint: `/api/events`
   - Beklenen Şema: `src/mockups/schemas/eventSchema.ts`
   - Mockup Örnek: `EVENT_SCHEMA`

2. **User API**

   - Base Endpoint: `/api/users`
   - Beklenen Şema: `src/mockups/schemas/userSchema.ts`
   - Mockup Örnek: `USER_SCHEMA`

3. **Report API**
   - Base Endpoint: `/api/reports`
   - Beklenen Şema: `src/mockups/schemas/reportSchema.ts`
   - Mockup Örnek: `REPORT_SCHEMA`

## Bileşen-Spesifik API Gereksinimleri

Her bileşen için gerekli olan özel veri yapıları, ilgili mockup dosyalarında belirtilmiştir. Backend ekibi, her endpoint için neyin döndürülmesi gerektiğini bu dosyalara bakarak anlayabilir.

### Örnek: Dashboard Etkinlikleri

```typescript
// Frontend'in beklediği yanıt yapısı
// GET /api/events/today
{
  events: [
    {
      id: "evt-001",
      title: "Morning Run Club",
      time: "07:00",
      location: "City Park",
      category: "sport",
      participants: 15,
      maxParticipants: 30,
      status: "approved",
    },
    // ...
  ];
}
```

## Dizin Yapısı

```
mockups/
├── README.md                  # Bu belgelendirme
├── schemas/                   # Tüm veri şemaları
│   ├── index.ts               # Tüm şemaları dışa aktarır
│   ├── eventSchema.ts         # Etkinlik veri yapısı
│   ├── userSchema.ts          # Kullanıcı veri yapısı
│   └── reportSchema.ts        # Rapor veri yapısı
├── components/                # Bileşene özel mockup verileri
│   ├── dashboard/             # Dashboard bileşenleri
│   ├── events/                # Etkinlik bileşenleri
│   ├── users/                 # Kullanıcı bileşenleri
│   ├── reports/               # Rapor bileşenleri
│   └── modals/                # Modal bileşenleri
└── index.ts                   # Ana dışa aktarma dosyası
```

## Yeni Mockup Ekleme

Mockup verisi gerektiren yeni bir bileşen oluştururken:

1. Verinizin mevcut bir şemaya uyup uymadığını kontrol edin
2. Uygun dizinde bileşene özel mockup dosyası oluşturun
3. Şemayı içe aktarın ve verinin bir alt kümesini oluşturun
4. Hangi bileşenin bu veriyi kullandığını belgelendirin

## Örnek

```typescript
// mockups/components/dashboard/todaysEvents.ts
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// TodaysEvents bileşeni için mockup verisi (/components/dashboard/TodaysEvents.tsx)
export const TODAY_EVENTS = EVENT_SCHEMA.events.slice(0, 5).map((event) => ({
  id: event.id,
  title: event.title,
  time: event.time,
  location: event.location,
  participants: event.participants,
  maxParticipants: event.maxParticipants,
  status: event.status,
}));
```

Bu yapı, tutarlı veri yapılarını korurken her bileşenin hangi verilere ihtiyaç duyduğunu net bir şekilde belirtmemizi sağlar.

## Constants ve Mockups Ayrımı

### Mockups Klasörü

- **Amaç**: Backend API'den gelecek olan dinamik verilerin simülasyonu
- **İçerik Tipi**: API yanıtlarını taklit eden veri modelleri, şemalar ve örnekler
- **Ne Zaman Kullanılmalı**: Bileşenlerde görüntülenecek içerikler, API'den gelecek listeler, kategoriler, kullanıcı verileri vb.
- **Örnekler**: Etkinlik kategorileri, kullanıcı listesi, rapor durumları

### Constants Klasörü

- **Amaç**: Uygulama çalışması için gerekli sabit değerlerin tanımlanması
- **İçerik Tipi**: Zaman aşımı değerleri, gecikme süreleri, API URL'leri, animasyon süreleri, format tanımları
- **Ne Zaman Kullanılmalı**: Uygulama davranışını belirleyen, API yanıtlarına bağlı olmayan gerçek sabitler
- **Örnekler**: API_URL, LOADING_DELAYS, DATE_FORMATS, BREAKPOINTS

### Kurallar

1. Bileşenlerde görüntülenecek **tüm veriler** mockups klasöründen alınmalıdır, constants'tan değil
2. API'den gelebilecek her türlü içerik (kategoriler, statüler, seçenekler) mutlaka mockups'ta tanımlanmalıdır
3. Constants yalnızca uygulama yapılandırması için gerekli değerleri içermelidir
4. Bileşenlerde hard-coded veri kullanmak yerine mockups'tan alınan veriler kullanılmalıdır

Bu ayrım sayesinde, API entegrasyonu geldiğinde yalnızca mockups klasörünün güncellenmesi yeterli olacaktır.

## Dashboard Bileşenleri ve Mockup Verileri

Bu bölümde, Dashboard'da aktif olarak kullanılan bileşenler ve bunların kullandığı mockup verilerini listelemekteyiz. Sadece şu anda kullanılan bileşenler ve veriler listelenmiştir.

### Dashboard Mockupları

| Mockup Verisi               | Bileşen Dosyası                                                | Kullanım                                   |
| --------------------------- | -------------------------------------------------------------- | ------------------------------------------ |
| TODAY_EVENTS                | src/components/dashboard/home/TodaysEvents.tsx                 | Dashboard'daki ana etkinlik listesi        |
| DASHBOARD_UPCOMING_EVENTS   | src/components/dashboard/home/TodaysEvents.tsx                 | İkincil etkinlik listesi                   |
| EVENT_PARTICIPANTS          | src/components/dashboard/home/TodaysEvents.tsx                 | Genişletilebilir katılımcı listesi         |
| RECENT_PARTICIPANTS         | src/components/dashboard/home/RecentParticipants.tsx           | Son katılımcı listesi                      |
| PARTICIPANT_DETAILS         | src/components/dashboard/home/RecentParticipants.tsx           | Katılımcı detay görünümü                   |
| MONTHLY_EVENT_DATA          | src/components/dashboard/analytics/MonthlyEventsChart.tsx      | Aylık etkinlik analiz grafiği              |
| DAILY_EVENT_DATA            | src/components/dashboard/analytics/EventParticipationChart.tsx | Günlük etkinlik katılım grafiği            |
| EVENT_CATEGORY_DISTRIBUTION | src/components/dashboard/analytics/EventParticipationChart.tsx | Etkinlik kategori dağılımı pie chart       |
| EVENT_STATUS_COUNTS         | src/components/dashboard/analytics/EventParticipationChart.tsx | Etkinlik durumu sayım ve yüzdeleri         |
| DASHBOARD_EVENT_CATEGORIES  | src/components/dashboard/analytics/EventParticipationChart.tsx | Filtreleme için etkinlik kategorileri      |
| EVENT_CATEGORY_NAMES        | src/components/dashboard/analytics/EventParticipationChart.tsx | Kategori isimlerinin insan dostu gösterimi |
| DAYS_OF_WEEK                | src/components/dashboard/analytics/EventParticipationChart.tsx | Hafta günleri etiketleri                   |
| LOADING_DELAYS              | Çeşitli dashboard bileşenleri                                  | Yükleme animasyonları için gecikmeler      |
| EVENT_STATUS_COLORS         | Çeşitli dashboard bileşenleri                                  | Etkinlik durumu renkleri                   |
| DASHBOARD_TABS              | src/contexts/DashboardContext.tsx, src/app/dashboard/page.tsx  | Dashboard sekme değerleri                  |
| DASHBOARD_TAB_LABELS        | src/app/dashboard/page.tsx                                     | Dashboard sekme etiketleri                 |
| MODAL_TYPES                 | src/app/dashboard/page.tsx                                     | Modal tipleri                              |
| UI_TEXT                     | src/app/dashboard/page.tsx, çeşitli dashboard bileşenleri      | Arayüz metinleri                           |
| RECENT_DASHBOARD_REPORTS    | src/app/dashboard/reports/page.tsx                             | Son raporlar listesi                       |

### İlgili Etkinlik Modülleri

| Mockup Verisi          | Bileşen Dosyası                            | Kullanım                           |
| ---------------------- | ------------------------------------------ | ---------------------------------- |
| SAMPLE_EVENT_DETAILS   | src/components/modals/EventDetailModal.tsx | Detaylı etkinlik bilgisi gösterimi |
| REJECTION_REASONS      | src/components/modals/EventDetailModal.tsx | Etkinlik red sebepleri             |
| CATEGORY_LABELS        | src/components/modals/EventDetailModal.tsx | Etkinlik kategori etiketleri       |
| EVENT_CATEGORY_OPTIONS | src/components/modals/NewEventModal.tsx    | Etkinlik kategori seçenekleri      |
| EVENT_STATUS_OPTIONS   | src/components/modals/EditEventModal.tsx   | Etkinlik durum seçenekleri         |
| DEFAULT_EVENT_FORM     | src/components/modals/NewEventModal.tsx    | Boş etkinlik formu şablonu         |

### İlgili Rapor Modülleri

| Mockup Verisi          | Bileşen Dosyası                             | Kullanım                          |
| ---------------------- | ------------------------------------------- | --------------------------------- |
| REPORT_STATUS_LABELS   | src/components/modals/ReportDetailModal.tsx | Rapor durumu etiketleri           |
| REPORT_PRIORITY_LABELS | src/components/modals/ReportDetailModal.tsx | Rapor öncelik seviyesi etiketleri |
| REPORT_PRIORITY_COLORS | src/components/modals/ReportDetailModal.tsx | Rapor öncelik seviyesi renkleri   |
| REPORT_STATUS_COLORS   | src/components/modals/ReportDetailModal.tsx | Rapor durumu renkleri             |
| ENTITY_TYPE_LABELS     | src/components/modals/ReportDetailModal.tsx | Rapor edilen öğe tür etiketleri   |
| SAMPLE_REPORT_DETAILS  | src/components/modals/ReportDetailModal.tsx | Detaylı rapor görünümü            |
| REPORT_FILTERS         | src/components/dashboard/reports            | Rapor filtreleme kriterleri       |
| REPORT_FILTER_LABELS   | src/components/dashboard/reports            | Rapor filtre etiketleri           |
