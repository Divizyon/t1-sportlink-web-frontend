"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Etkinlik kategorileri
const EVENT_CATEGORIES = [
  "Futbol",
  "Basketbol",
  "Yüzme",
  "Tenis",
  "Voleybol",
  "Koşu",
  "Yoga",
  "Fitness"
]

interface CategoryFilterDropdownProps {
  selectedCategories: string[]
  onSelectCategories: (categories: string[]) => void
}

export function CategoryFilterDropdown({
  selectedCategories,
  onSelectCategories,
}: CategoryFilterDropdownProps) {
  const [open, setOpen] = useState(false)

  // Kategori seçimini değiştirme işlevi
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onSelectCategories(selectedCategories.filter((c) => c !== category))
    } else {
      onSelectCategories([...selectedCategories, category])
    }
  }

  // Tüm seçimleri temizleme
  const clearSelections = () => {
    onSelectCategories([])
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <Filter className="mr-2 h-4 w-4" />
          <span>Kategoriler</span>
          {selectedCategories.length > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
              {selectedCategories.length}
            </Badge>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Kategori ara..." />
          <CommandList>
            <CommandEmpty>Kategori bulunamadı.</CommandEmpty>
            <CommandGroup>
              {EVENT_CATEGORIES.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => toggleCategory(category)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedCategories.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearSelections}
                    className="justify-center text-center text-sm"
                  >
                    Filtreleri Temizle
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 