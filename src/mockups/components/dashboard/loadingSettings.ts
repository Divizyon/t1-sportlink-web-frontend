/**
 * Dashboard UI Loading Settings Mockups
 *
 * Dashboard bileşenlerinde kullanılan yükleme ve performans ayarları.
 * Bu değerler, kullanıcı arayüzünün zamanlaması ve performans davranışlarını kontrol eden,
 * yüklenme süreleri, gecikme süreleri gibi değerlerdir.
 *
 * Gerçek değerler API'den gelmez, ancak genellikle uygulama ayarlarından veya
 * yapılandırmadan alınır.
 */

// Yükleme gecikmeleri için simüle edilmiş süreler
export const LOADING_DELAYS = {
  short: 300, // ms
  medium: 800, // ms
  long: 1200, // ms
  extraLong: 2000, // ms
};

// Dashboard görünüm ayarları
export const DASHBOARD_VIEW_SETTINGS = {
  defaultPageSize: 10,
  maxPageSize: 50,
  searchMinLength: 2,
  refreshInterval: 60000, // 1 dakika
  chartAnimationDuration: 500, // ms
};

// Dashboard veri ayarları
export const DASHBOARD_DATA_SETTINGS = {
  cacheExpiryTime: 5 * 60 * 1000, // 5 dakika
  maxDisplayedItems: 5,
  maxChartItems: 7,
  infiniteScrollThreshold: 80, // %
  maxNotificationsDisplayed: 5,
};

// Dashboard animasyon ve geçiş süreleri
export const ANIMATION_TIMINGS = {
  fadeIn: 200, // ms
  fadeOut: 150, // ms
  slideIn: 300, // ms
  expand: 250, // ms
  collapse: 200, // ms
};
