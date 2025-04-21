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
  return events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm)
  );
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
