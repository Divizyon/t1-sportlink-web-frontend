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

## Migrate Edilmesi Gereken Constants

Aşağıdaki öğeler hala `constants/dashboard.ts` içinde bulunuyor ve `mockups/` klasörüne taşınmalıdır:

1. **Dashboard Tab İlgili**:

   - `DASHBOARD_TABS` ve `DASHBOARD_TAB_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`
   - `DASHBOARD_MODAL_TYPES` ve `DASHBOARD_MODAL_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`
   - `DASHBOARD_UI_TEXT` → `/mockups/components/dashboard/dashboardSettings.ts`

2. **Event İlgili**:

   - `EVENT_CATEGORIES` ve `EVENT_CATEGORY_LABELS` → `/mockups/schemas/eventSchema.ts`

3. **Diğer UI İlgili**:
   - `DASHBOARD_STATUS_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`

**NOT**: `DASHBOARD_SETTINGS` gibi gerçek konfigürasyon değerleri constants içinde kalmalıdır.

## Bileşen Referansları

Bu bölüm, her mockup verisinin hangi bileşenlerde kullanıldığına dair doğrudan referanslar sağlar. Bu, veri kullanımını izlemek ve migrasyon planlaması için faydalıdır.

### Dashboard Mockupları

| Mockup Verisi             | Bileşen Dosyası                                           | Kullanım                            |
| ------------------------- | --------------------------------------------------------- | ----------------------------------- |
| TODAY_EVENTS              | src/components/dashboard/home/TodaysEvents.tsx            | Dashboard'daki ana etkinlik listesi |
| DASHBOARD_UPCOMING_EVENTS | src/components/dashboard/home/TodaysEvents.tsx            | İkincil etkinlik listesi            |
| EVENT_PARTICIPANTS        | src/components/dashboard/home/TodaysEvents.tsx            | Genişletilebilir katılımcı listesi  |
| RECENT_PARTICIPANTS       | src/components/dashboard/home/RecentParticipants.tsx      | Son katılımcı listesi               |
| MONTHLY_EVENT_DATA        | src/components/dashboard/analytics/MonthlyEventsChart.tsx | Aylık etkinlik analiz grafiği       |
| CATEGORY_DISTRIBUTION     | src/hooks/useAnalytics.ts                                 | Kategori dağılımı analizi           |
| EVENT_STATUS_DISTRIBUTION | src/hooks/useAnalytics.ts                                 | Etkinlik durumu dağılımı            |

### Etkinlik Mockupları

| Mockup Verisi             | Bileşen Dosyası                                                                                                              | Kullanım                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SAMPLE_EVENT_DETAILS      | src/components/modals/EventDetailModal.tsx                                                                                   | Detaylı etkinlik bilgisi gösterimi |
| UPCOMING_EVENTS           | _Tanımlanmış fakat kullanılmıyor_                                                                                            | Yaklaşan etkinlikler listesi       |
| DASHBOARD_UPCOMING_EVENTS | src/components/dashboard/home/TodaysEvents.tsx                                                                               | İkincil etkinlik listesi           |
| PAST_EVENTS               | _Tanımlanmış fakat kullanılmıyor_                                                                                            | Geçmiş etkinlikler listesi         |
| EVENT_CATEGORIES          | src/components/dashboard/analytics/EventParticipationChart.tsx                                                               | Etkinlik kategorisi listesi        |
| EVENT_CATEGORY_OPTIONS    | src/components/CategoryFilterDropdown.tsx, src/components/modals/NewEventModal.tsx, src/components/modals/EditEventModal.tsx | Etkinlik kategori seçenekleri      |
| EVENT_STATUS_OPTIONS      | _Tanımlanmış fakat kullanılmıyor_                                                                                            | Etkinlik durum seçenekleri         |
| DEFAULT_EVENT_FORM        | src/components/modals/NewEventModal.tsx                                                                                      | Boş etkinlik formu şablonu         |

### Kullanıcı Mockupları

| Mockup Verisi        | Bileşen Dosyası                                      | Kullanım                           |
| -------------------- | ---------------------------------------------------- | ---------------------------------- |
| RECENT_PARTICIPANTS  | src/components/dashboard/home/RecentParticipants.tsx | Son katılımcı listesi              |
| RECENT_USERS         | _Tanımlanmış fakat kullanılmıyor_                    | Son kullanıcılar listesi           |
| ACTIVE_USERS         | _Tanımlanmış fakat kullanılmıyor_                    | Aktif kullanıcılar listesi         |
| ADMIN_USERS          | _Tanımlanmış fakat kullanılmıyor_                    | Yönetici kullanıcılar listesi      |
| PARTICIPANT_DETAILS  | src/components/dashboard/home/RecentParticipants.tsx | Katılımcı detay görünümü           |
| SAMPLE_USER_ACTIVITY | _Tanımlanmış fakat kullanılmıyor_                    | Kullanıcı aktivite zaman çizelgesi |
| MOCK_MESSAGES        | _Tanımlanmış fakat kullanılmıyor_                    | Kullanıcı mesajlaşma işlevselliği  |
| MOCK_CONVERSATIONS   | _Tanımlanmış fakat kullanılmıyor_                    | Konuşma yönetimi                   |

### Rapor Mockupları

| Mockup Verisi              | Bileşen Dosyası                             | Kullanım                                 |
| -------------------------- | ------------------------------------------- | ---------------------------------------- |
| SAMPLE_REPORT_DETAILS      | src/components/modals/ReportDetailModal.tsx | Detaylı rapor görünümü                   |
| RECENT_REPORTS             | _Tanımlanmış fakat kullanılmıyor_           | Son raporlar listesi                     |
| HIGH_PRIORITY_REPORTS      | _Tanımlanmış fakat kullanılmıyor_           | Filtrelenmiş yüksek öncelikli raporlar   |
| PENDING_REPORTS            | _Tanımlanmış fakat kullanılmıyor_           | Filtrelenmiş bekleyen raporlar           |
| REPORT_ENTITY_TYPE_OPTIONS | _Tanımlanmış fakat kullanılmıyor_           | Rapor varlık tipi filtreleme seçenekleri |
| REPORT_STATUS_OPTIONS      | _Tanımlanmış fakat kullanılmıyor_           | Rapor durum filtreleme seçenekleri       |
| REPORT_PRIORITY_OPTIONS    | _Tanımlanmış fakat kullanılmıyor_           | Rapor öncelik filtreleme seçenekleri     |

### Haber/İçerik Mockupları

| Mockup Verisi     | Bileşen Dosyası                   | Kullanım                |
| ----------------- | --------------------------------- | ----------------------- |
| SAMPLE_NEWS_ITEMS | _Tanımlanmış fakat kullanılmıyor_ | Haber içerik yönetimi   |
| NEWS_TYPES        | _Tanımlanmış fakat kullanılmıyor_ | Haber tipi seçenekleri  |
| EMPTY_NEWS_FORM   | _Tanımlanmış fakat kullanılmıyor_ | Boş haber formu şablonu |
