// Örnek filtre işlevleri
// Bu kütüphane, genel filtre işlevlerini içerir

// constants yerine mockups'tan veri yapılarını alalım
import { EVENT_CATEGORIES, EVENT_STATUS } from "@/mockups";
import { Event, EventCategory, EventStatus, ReportFilterType } from "@/types";

/**
 * Etkinlikleri belirli bir kategoriye göre filtreler
 * @param events Filtrelenecek etkinlik listesi
 * @param category Filtrelenecek kategori
 * @returns Filtrelenmiş etkinlik listesi
 */
export function filterEventsByCategory(
  events: Event[],
  category: string
): Event[] {
  if (category === "all") {
    return events;
  }
  return events.filter((event) => event.category === category);
}

/**
 * Etkinlikleri belirli bir duruma göre filtreler
 * @param events Filtrelenecek etkinlik listesi
 * @param status Filtrelenecek durum
 * @returns Filtrelenmiş etkinlik listesi
 */
export function filterEventsByStatus(
  events: Event[],
  status: EventStatus
): Event[] {
  return events.filter((event) => event.status === status);
}

/**
 * Etkinlikleri arama terimine göre filtreler
 * @param events Filtrelenecek etkinlik listesi
 * @param term Arama terimi
 * @returns Filtrelenmiş etkinlik listesi
 */
export function searchEvents(events: Event[], term: string): Event[] {
  const searchTerm = term.toLowerCase();
  return events.filter((item) => item.title.toLowerCase().includes(searchTerm));
}

/**
 * Tüm kategorilerin seçili olup olmadığını kontrol eder
 * @param selectedCategories Seçili kategoriler listesi
 * @returns Tüm kategoriler seçili ise true
 */
export function isAllCategoriesSelected(selectedCategories: string[]): boolean {
  return selectedCategories.length === Object.keys(EVENT_CATEGORIES).length;
}

/**
 * Tüm kategorileri döndürür
 * @returns Tüm kategori listesi
 */
export function getAllCategories(): string[] {
  return Object.keys(EVENT_CATEGORIES);
}

/**
 * Kategori seçimini günceller
 * @param selectedCategories Mevcut seçili kategoriler
 * @param category Eklenecek veya çıkarılacak kategori
 * @returns Güncellenmiş kategori listesi
 */
export function toggleCategory(
  selectedCategories: string[],
  category: string
): string[] {
  if (category === "all") {
    if (selectedCategories.length === Object.keys(EVENT_CATEGORIES).length) {
      return [];
    } else {
      return getAllCategories();
    }
  }

  const isSelected = selectedCategories.includes(category);
  if (isSelected) {
    return selectedCategories.filter((c) => c !== category);
  } else {
    return [...selectedCategories, category];
  }
}

/**
 * Durum seçimini günceller
 * @param selectedStatuses Mevcut seçili durumlar
 * @param status Eklenecek veya çıkarılacak durum
 * @returns Güncellenmiş durum listesi
 */
export function toggleStatus(
  status: EventStatus | "all",
  selectedStatuses: EventStatus[]
): EventStatus[] {
  if (status === "all") {
    if (selectedStatuses.length === Object.keys(EVENT_STATUS).length) {
      return [];
    } else {
      return Object.keys(EVENT_STATUS) as EventStatus[];
    }
  }

  const isSelected = selectedStatuses.includes(status);
  if (isSelected) {
    return selectedStatuses.filter((s) => s !== status);
  } else {
    return [...selectedStatuses, status];
  }
}

/**
 * URL parametrelerinden filtre değerlerini ayıklar
 * @param urlParams URL parametreleri
 * @returns Ayıklanmış filtre nesnesi
 */
export function parseFilterParams(urlParams: URLSearchParams): {
  categories: string[];
  statuses: EventStatus[];
} {
  const categoriesParam = urlParams.get("categories");
  const statusesParam = urlParams.get("statuses");

  return {
    categories: categoriesParam ? categoriesParam.split(",") : [],
    statuses: statusesParam ? (statusesParam.split(",") as EventStatus[]) : [],
  };
}

/**
 * Filtre değerlerinden URL sorgu dizesini oluşturur
 * @param categories Kategori listesi
 * @param statuses Durum listesi
 * @returns URL sorgu dizesi
 */
export function buildFilterQueryString(
  categories: string[],
  statuses: EventStatus[]
): string {
  const params = new URLSearchParams();

  if (categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  if (statuses.length > 0) {
    params.set("statuses", statuses.join(","));
  }

  return params.toString();
}

/**
 * Filtre öğesinin aktif olup olmadığını belirler
 * @param key Filtre anahtarı
 * @param value Filtre değeri
 * @returns Filtre aktif ise true
 */
export function isFilterActive(key: string, value: any): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return (
    value !== "" && value !== "all" && value !== null && value !== undefined
  );
}
