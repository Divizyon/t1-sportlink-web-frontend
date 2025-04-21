# Mockups Migrasyon Durum Raporu

Bu belge, constants ve mockups arasındaki veri taşıma işlemlerinin durumunu izlemek için oluşturulmuştur.

## Görev Listesi

### Tamamlanan Görevler ✅

1. **Mockups klasörünün tamamlanmış yapısı**:

   - `/schemas/`: Tüm ana veri yapıları
   - `/components/`: Bileşene özel mockup verileri
   - `/index.ts`: Merkezi dışa aktarma dosyası

2. **Taşınan constants'tan mockups'a**:

   - ✅ `EVENT_STATUS` ve `EVENT_STATUS_LABELS` → `/mockups/schemas/eventSchema.ts`
   - ✅ `EVENT_STATUS_COLORS` → `/mockups/schemas/eventSchema.ts`
   - ✅ `EVENT_CATEGORIES` ve `EVENT_CATEGORY_LABELS` → `/mockups/schemas/eventSchema.ts`
   - ✅ `REPORT_STATUS` ve `REPORT_STATUS_LABELS` → `/mockups/schemas/reportSchema.ts`
   - ✅ `REPORT_PRIORITY` ve `REPORT_PRIORITY_LABELS` → `/mockups/schemas/reportSchema.ts`
   - ✅ `ENTITY_TYPE_LABELS` → `/mockups/schemas/reportSchema.ts`
   - ✅ `REPORT_STATUS_COLORS` ve `REPORT_PRIORITY_COLORS` → `/mockups/schemas/reportSchema.ts`
   - ✅ `REPORT_FILTERS` ve `REPORT_FILTER_LABELS` → `/mockups/components/reports/index.ts`
   - ✅ `DASHBOARD_TABS` ve `DASHBOARD_TAB_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`
   - ✅ `MODAL_TYPES` ve `MODAL_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`
   - ✅ `UI_TEXT` → `/mockups/components/dashboard/dashboardSettings.ts`
   - ✅ `DASHBOARD_STATUS_LABELS` → `/mockups/components/dashboard/dashboardSettings.ts`
   - ✅ `DASHBOARD_ADMIN_ROLES` → `/mockups/schemas/userSchema.ts`
   - ✅ `USER_ROLES` ve `USER_ROLE_LABELS` → `/mockups/schemas/userSchema.ts`
   - ✅ `LOADING_DELAYS` → `/mockups/components/dashboard/loadingSettings.ts`

3. **README güncellendi**:

   - ✅ Veri Yönetim Mimarisi: Types, Constants ve Mockups açıklamaları
   - ✅ Doğru ve hatalı kullanım örnekleri
   - ✅ Backend entegrasyonu için beklenen API yanıtları

4. **Types Güncellemeleri**:

   - ✅ `TabType` tanımı eklendi
   - ✅ `ModalType` güncellendi
   - ✅ `ReportFilterType` güncellendi
   - ✅ `UserRole` güncellendi
   - ✅ `EventCategory` güncellendi
   - ✅ Geriye dönük uyumluluk için eski tipler korundu

5. **Örnek Bileşen Güncellemesi**:

   - ✅ `filterUtils.ts` içindeki referanslar constants'tan mockups'a çevrildi
   - ✅ Tip güvenliği ve modern ES6 biçimlendirmesi uygulandı
   - ✅ `EVENT_CATEGORIES` kullanımı Object.keys() ile güncellendi
   - ✅ Lint ve tip hatalarının temizlenmesi için iyi bir örnek oluşturuldu

6. **Import Düzeltmeleri**:
   - ✅ `dashboardUtils.ts` içindeki constants importları mockups'a taşındı (COLORS ve DAYS_OF_WEEK hariç)
   - ✅ `EventParticipationChart.tsx` içindeki LOADING_DELAYS importu mockups'a taşındı
   - ⏳ Tüm `/components` klasöründeki bileşenlerin import işlemlerini constants'tan mockups'a çevirme
   - ⏳ `useDashboardEvents.ts` ve diğer hook'larda import referanslarını düzeltme

### Bekleyen Görevler ⏳

1. **Import Düzeltmeleri (Devam Eden)**:

   - ⏳ Kalan diğer dosyalarda (lib, utils, vb.) hala constants'a yapılan referansları düzeltme

2. **Geriye Kalan Sabit Tanımları**:

   - ✅ `DASHBOARD_SETTINGS` gibi gerçek sabit değerlerin constants içinde doğru bir şekilde kaldığını doğrulama
   - ✅ Constants'tan mockups'a taşınması gereken başka veri yapılarının olup olmadığını kontrol etme

3. **Bileşenlerde Hardcoded Verilerden Kurtulma**:

   - ⏳ Bileşenlerdeki tüm sabit verilerin mockups'tan alınması
   - ⏳ İnline tanımlanan sabit veri yapılarını ilgili mockup dosyalarına taşıma

4. **Test ve Doğrulama**:
   - ⏳ Tüm migrasyon değişikliklerinin uygulamada test edilmesi
   - ⏳ Eksik/yanlış referans kalmadığından emin olunması

## Bugün Yapılan Değişiklikler (✅ Yeni Tamamlananlar)

1. **UserSchema Güncellemeleri**:

   - ✅ `UserRole` tipi güncellendi, yeni roller eklendi (admin, director, staff, head_coach, coach)
   - ✅ `USER_ROLES` sabiti eklendi
   - ✅ `USER_ROLE_LABELS` sabiti eklendi
   - ✅ `DASHBOARD_ADMIN_ROLES` sabiti eklendi

2. **EventSchema Güncellemeleri**:

   - ✅ `EventCategory` tipi güncellendi, "all" ve "match" değerleri eklendi
   - ✅ `EVENT_CATEGORIES` Record tipine dönüştürüldü ve genişletildi
   - ✅ `EVENT_CATEGORY_LABELS` Record tipine dönüştürüldü ve genişletildi

3. **Dashboard Settings Güncellemeleri**:

   - ✅ `UI_TEXT` objesi genişletildi, eski `DASHBOARD_UI_TEXT`ten gelen değerler eklendi

4. **Dashboard UI Constants**:

   - ✅ Yeni `loadingSettings.ts` dosyası oluşturuldu (eski `constants.ts`)
   - ✅ `LOADING_DELAYS` değerleri bu dosyaya taşındı
   - ✅ Ek ayarlar ve yapılandırmalar için `DASHBOARD_VIEW_SETTINGS`, `DASHBOARD_DATA_SETTINGS` ve `ANIMATION_TIMINGS` eklendi
   - ✅ Dosya ismi ve açıklamaları iyileştirildi, mimari daha net hale getirildi

5. **Lib ve Component İmport Düzeltmeleri**:

   - ✅ `dashboardUtils.ts` dosyasındaki constants importları mockups'a taşındı (COLORS ve DAYS_OF_WEEK hariç)
   - ✅ `EventParticipationChart.tsx` dosyasındaki LOADING_DELAYS importu mockups'a taşındı

6. **Migrasyon Durum Raporu Güncellemeleri**:
   - ✅ Yeni tamamlanan görevler eklendi
   - ✅ Kalan görevler güncellendi
   - ✅ Dosya isimlendirmesi iyileştirmeleri eklendi

## Sonraki Adımlar

Öncelik sırasına göre:

1. **Import düzeltmelerine devam etme**

   - Components klasörü içerisinde constants kullanımlarını tespit etme ve düzeltme
   - Hooks klasöründe constants kullanımlarını tespit etme ve düzeltme

2. **Hardcoded verileri mockups'a taşıma**

   - Bileşenlerde hardcoded veri değerlerini tespit etme
   - İlgili mockup dosyalarını oluşturma veya güncelleme

3. **Tip sorunlarını çözme**
   - dashboardUtils.ts dosyasındaki tip hatalarını düzelt
   - Diğer dosyalardaki tip hatalarını tespit et ve düzelt

## Genel İzleme Planı

### 1. Component-by-Component Analiz

Her bileşeni aşağıdaki adımlarla analiz edin:

1. Bileşeni açın ve import edilen tüm verileri inceleyin.
2. Constants'tan gelen veriler varsa, bunları mockups'taki eşdeğerleriyle değiştirin.
3. Bileşen içindeki hardcoded değerleri (kategori listeleri, durum mesajları, seçenekler) belirleyin.
4. Bu değerleri uygun mockup dosyalarına taşıyın veya yeni mockup dosyaları oluşturun.
5. Component'i mockup verilerini kullanacak şekilde güncelleyin.

### 2. Grep Tabanlı Arama ve Düzeltme

Aşağıdaki arama desenleriyle tüm projeyi tarayın:

```
import { ... } from "@/constants"  // constants'tan yapılan tüm importları bulma
const HARDCODED = [...]  // bileşen içinde tanımlanan sabit dizileri bulma
{ label: "...", value: "..." }  // seçenek nesnelerini bulma
```

### 3. Types ve Mockups Eşleştirmesi

Tip tanımlarının mockup verilerle uyumlu olduğundan emin olun:

1. Her şema dosyasının ilgili tip dosyasıyla aynı yapıya sahip olduğunu doğrulayın.
2. Tip tanımlarında eksik alanlar varsa güncelleme yapın.
3. Mockuplarda eksik alanlar varsa ekleyin.

## Örnek Yeniden Yapılandırma: filterUtils.ts

Örnek bir yeniden yapılandırma işlemi tamamlandı:

```typescript
// Önceki hali - Constants kullanımı
import { EVENT_CATEGORIES } from "@/constants";

// Yeni hali - Mockups kullanımı
import { EVENT_CATEGORIES, EVENT_STATUS } from "@/mockups";
import { Event, EventCategory, EventStatus, ReportFilterType } from "@/types";
```

Bu örnekte:

- Constants yerine mockups'tan import yapıldı
- Tip güvenliği için doğru tanımlar eklendi
- Eskiden array olarak kullanılan EVENT_CATEGORIES, artık object olarak alındığından Object.keys() kullanıldı
- Bağımlılık azaltılıp, doğrudan mockups'a bağlanma sağlandı

## Sonraki Adımlar

1. En çok kullanılan bileşenlerden başlayarak, yukarıdaki adımları takip edin ve her değişikliği test edin.
2. Bir bileşen listesi oluşturun ve her bir bileşendeki migrasyon durumunu takip edin.
3. Bir PR oluşturmadan önce, tüm bileşenlerde lint hatası olmadığından emin olun.
4. Yapılan değişikliklerin dökümantasyonunu güncelleyin ve backend ekibine iletin.

## Notlar

- constants klasöründe sadece gerçek sabit değerler kalmalı (URL'ler, gecikme değerleri, sayfa boyutları vb.)
- tüm UI metinleri, durum etiketleri, kategori listeleri ve benzeri API'den gelebilecek değerler mockups içinde olmalı
- isim çakışmalarına dikkat edilmeli, mockups dışa aktarımlarında namespace kullanılmalı

## Örnek Service Layer İçin Not (İleriki Aşamalarda)

Sonraki aşamada, mockups'tan gerçek API'ye geçişi kolaylaştırmak için bir service layer oluşturulması planlanmaktadır. Bu katman, şu şekilde çalışacaktır:

```typescript
// Örnek mockup service
export async function fetchTodayEvents() {
  // Geliştirme ortamında mockup verisini döndür
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TODAY_EVENTS);
      }, 300); // Simüle edilmiş gecikme
    });
  }

  // Üretim ortamında gerçek API çağrısı yap
  const response = await fetch("/api/events/today");
  const data = await response.json();
  return data;
}
```

Bu şekilde, bileşenler her zaman aynı fonksiyonları kullanacak, ancak ortama göre veri kaynağı farklılaşacaktır.

## Son Yapılan Değişiklikler ✅

1. **Modal Tipleri Güncellemesi**:

   - ✅ `MODAL_TYPES` nesnesine geriye dönük uyumluluk için eski tiplerle eşleştirmeler eklendi (`EVENT: "viewEvent"` vb.)
   - ✅ `MODAL_LABELS` nesnesi de benzer şekilde güncellendi
   - ✅ Tip tanımı Record<ModalType, ModalType> yerine daha esnek Record<string, string> ile değiştirildi

2. **README Sadeleştirmesi**:
   - ✅ Daha okunaklı ve özet bir yapıya getirildi
   - ✅ Önemli bilgiler öne çıkarıldı
   - ✅ Kullanım örnekleri basitleştirildi

## Öncelikli Yapılacaklar

1. Dashboard sayfasında kullanılan modalların test edilmesi
2. Kalan bileşenlerdeki constants importlarının tespit edilmesi
3. Hardcoded veri içeren bileşenlerin belirlenmesi

## Öneriler ve Kurallar

- Constants klasöründe sadece gerçek sabitler kalmalı (API URL'leri, gecikme süreleri vb.)
- UI metinleri, etiketler ve API'den gelebilecek veri mock'ları mockups'ta tutulmalı
- Daima tip güvenliği sağlanmalı, gerekirse Record<string, string> şeklinde esnek tipler kullanılmalı
