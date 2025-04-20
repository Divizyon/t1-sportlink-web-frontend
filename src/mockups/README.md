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
│   └── userSchema.ts          # Kullanıcı veri yapısı
├── components/                # Bileşene özel mockup verileri
│   ├── dashboard/             # Dashboard bileşenleri
│   │   ├── todaysEvents.ts    # TodaysEvents bileşeni için veriler
│   │   ├── analyticsCharts.ts # Analitik grafikleri için veriler
│   │   └── ...
│   ├── events/                # Etkinlik bileşenleri
│   └── users/                 # Kullanıcı bileşenleri
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

| Mockup Verisi          | Bileşen Dosyası                            | Kullanım                           |
| ---------------------- | ------------------------------------------ | ---------------------------------- |
| SAMPLE_EVENT_DETAILS   | src/components/modals/EventDetailModal.tsx | Detaylı etkinlik bilgisi gösterimi |
| UPCOMING_EVENTS        | _Tanımlanmış fakat kullanılmıyor_          | Yaklaşan etkinlikler listesi       |
| PAST_EVENTS            | _Tanımlanmış fakat kullanılmıyor_          | Geçmiş etkinlikler listesi         |
| EVENT_CATEGORIES       | _Tanımlanmış fakat kullanılmıyor_          | Etkinlik kategorisi filtreleme     |
| EVENT_CATEGORY_OPTIONS | src/components/events/EventForm.tsx        | Etkinlik kategori seçenekleri      |
| EVENT_STATUS_OPTIONS   | src/components/events/EventForm.tsx        | Etkinlik durum seçenekleri         |
| DEFAULT_EVENT_FORM     | src/components/events/EventForm.tsx        | Boş etkinlik formu şablonu         |

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
