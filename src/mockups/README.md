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
├── migration/                 # Migrasyon belgelendirmesi
│   └── PHASE5_DOCUMENTATION.md # Yeni yapının kullanımı için rehber
└── index.ts                   # Ana dışa aktarma dosyası
```

## Kullanım Yönergeleri

1. `schemas` dizini, her varlık tipi için tüm veri modellerini içerir
2. Bileşen mockupları her zaman ana şemaları referans almalı ve alt kümelerini kullanmalıdır
3. Her bileşen mockup dosyası şunları yapmalıdır:
   - Hangi bileşen için olduğunu belgelemek
   - Sadece o bileşen için gereken belirli verileri içermek
   - Ana şema ile aynı özellik isimlerini korumak

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

| Mockup Verisi             | Bileşen Dosyası                                                                                           | Kullanım                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SAMPLE_EVENT_DETAILS      | src/components/modals/EventDetailModal.tsx                                                                | Detaylı etkinlik bilgisi gösterimi |
| UPCOMING_EVENTS           | _Tanımlanmış fakat kullanılmıyor_                                                                         | Yaklaşan etkinlikler listesi       |
| DASHBOARD_UPCOMING_EVENTS | src/components/dashboard/home/TodaysEvents.tsx                                                            | İkincil etkinlik listesi           |
| PAST_EVENTS               | _Tanımlanmış fakat kullanılmıyor_                                                                         | Geçmiş etkinlikler listesi         |
| EVENT_CATEGORIES          | src/components/CategoryFilterDropdown.tsx, src/components/dashboard/analytics/EventParticipationChart.tsx | Etkinlik kategorisi listesi        |
| EVENT_CATEGORY_OPTIONS    | src/components/modals/NewEventModal.tsx, src/components/modals/EditEventModal.tsx                         | Etkinlik kategori seçenekleri      |
| EVENT_STATUS_OPTIONS      | _Tanımlanmış fakat kullanılmıyor_                                                                         | Etkinlik durum seçenekleri         |
| DEFAULT_EVENT_FORM        | src/components/modals/NewEventModal.tsx                                                                   | Boş etkinlik formu şablonu         |

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

## Constants ve Mockups Ayrımı

Projede veri yönetimi için iki ayrı yaklaşım kullanılmaktadır:

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

### Constants'tan Mockups'a Taşınan Öğeler

Aşağıdaki öğeler constants/dashboard.ts'den mockups klasörüne taşındı:

1. **Etkinlik İlgili**:

   - EVENT_STATUS ve EVENT_STATUS_LABELS → `/schemas/eventSchema.ts`
   - EVENT_STATUS_COLORS → `/schemas/eventSchema.ts`

2. **Rapor İlgili**:

   - REPORT_STATUS ve REPORT_STATUS_LABELS → `/schemas/reportSchema.ts`
   - REPORT_PRIORITY ve REPORT_PRIORITY_LABELS → `/schemas/reportSchema.ts`
   - ENTITY_TYPE_LABELS → `/schemas/reportSchema.ts`
   - REPORT_STATUS_COLORS ve REPORT_PRIORITY_COLORS → `/schemas/reportSchema.ts`

3. **Dashboard İlgili**:
   - DASHBOARD_TABS ve DASHBOARD_TAB_LABELS → `/components/dashboard/dashboardSettings.ts`
   - MODAL_TYPES → `/components/dashboard/dashboardSettings.ts`
   - UI_TEXT → `/components/dashboard/dashboardSettings.ts`
