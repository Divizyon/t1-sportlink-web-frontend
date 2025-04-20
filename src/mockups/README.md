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

| Mockup Verisi       | Bileşen Dosyası                                           | Kullanım                            |
| ------------------- | --------------------------------------------------------- | ----------------------------------- |
| TODAY_EVENTS        | src/components/dashboard/home/TodaysEvents.tsx            | Dashboard'daki ana etkinlik listesi |
| UPCOMING_EVENTS     | src/components/dashboard/home/TodaysEvents.tsx            | İkincil etkinlik listesi            |
| EVENT_PARTICIPANTS  | src/components/dashboard/home/TodaysEvents.tsx            | Genişletilebilir katılımcı listesi  |
| RECENT_PARTICIPANTS | src/components/dashboard/home/RecentParticipants.tsx      | Son katılımcı listesi               |
| MONTHLY_EVENT_DATA  | src/components/dashboard/analytics/MonthlyEventsChart.tsx | Aylık etkinlik analiz grafiği       |

### Etkinlik Mockupları

| Mockup Verisi        | Bileşen Dosyası                            | Kullanım                            |
| -------------------- | ------------------------------------------ | ----------------------------------- |
| SAMPLE_EVENT_DETAILS | src/components/modals/EventDetailModal.tsx | Detaylı etkinlik bilgisi gösterimi  |
| UPCOMING_EVENTS      | src/components/events/EventList.tsx        | Yaklaşan etkinlikler listesi        |
| PAST_EVENTS          | src/components/events/EventList.tsx        | Geçmiş etkinlikler listesi          |
| EVENT_CATEGORIES     | src/components/events/EventFilters.tsx     | Etkinlik kategorisi filtreleme      |
| SAMPLE_EVENT_MODAL   | src/components/modals/EventModal.tsx       | Etkinlik oluşturma/düzenleme modalı |

### Kullanıcı Mockupları

| Mockup Verisi        | Bileşen Dosyası                          | Kullanım                           |
| -------------------- | ---------------------------------------- | ---------------------------------- |
| RECENT_USERS         | src/components/users/UserList.tsx        | Son kullanıcılar listesi           |
| ACTIVE_USERS         | src/components/users/UserList.tsx        | Aktif kullanıcılar listesi         |
| ADMIN_USERS          | src/components/users/UserList.tsx        | Yönetici kullanıcılar listesi      |
| SAMPLE_USER_ACTIVITY | src/components/users/UserActivityLog.tsx | Kullanıcı aktivite zaman çizelgesi |
| MOCK_MESSAGES        | src/hooks/useMessages.ts                 | Kullanıcı mesajlaşma işlevselliği  |
| MOCK_CONVERSATIONS   | src/hooks/useMessages.ts                 | Konuşma yönetimi                   |
| SAMPLE_USER_MODAL    | src/components/modals/UserModal.tsx      | Kullanıcı profili düzenleme modalı |

### Rapor Mockupları

| Mockup Verisi              | Bileşen Dosyası                             | Kullanım                               |
| -------------------------- | ------------------------------------------- | -------------------------------------- |
| SAMPLE_REPORT_DETAILS      | src/components/modals/ReportDetailModal.tsx | Detaylı rapor görünümü                 |
| RECENT_REPORTS             | src/components/reports/ReportList.tsx       | Son raporlar listesi                   |
| HIGH_PRIORITY_REPORTS      | src/components/reports/ReportList.tsx       | Filtrelenmiş yüksek öncelikli raporlar |
| PENDING_REPORTS            | src/components/reports/ReportList.tsx       | Filtrelenmiş bekleyen raporlar         |
| SAMPLE_REPORT_FORM         | src/components/modals/ReportsModal.tsx      | Rapor oluşturma formu                  |
| SAMPLE_REPORT_CONFIRMATION | src/components/modals/ReportsModal.tsx      | Rapor onay gösterimi                   |

### Haber/İçerik Mockupları

| Mockup Verisi            | Bileşen Dosyası                     | Kullanım              |
| ------------------------ | ----------------------------------- | --------------------- |
| SAMPLE_NEWS_ITEMS        | src/hooks/useNews.ts                | Haber içerik yönetimi |
| SAMPLE_NEWS_FORM         | src/components/modals/NewsModal.tsx | Haber oluşturma formu |
| SAMPLE_NEWS_CONFIRMATION | src/components/modals/NewsModal.tsx | Haber yayınlama onayı |
