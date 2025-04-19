"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryFilterDropdownProps } from "@/types/dashboard";
import { EVENT_CATEGORIES } from "@/constants/dashboard";
import { toggleCategory } from "@/lib/filterUtils";

export function CategoryFilterDropdown({
  selectedCategories,
  onChange,
}: CategoryFilterDropdownProps) {
  const [open, setOpen] = useState(false);

  // Handle category toggle using utility function
  const handleToggleCategory = (category: string) => {
    onChange(toggleCategory(category, selectedCategories));
  };

  // Clear all selections
  const clearSelections = () => {
    onChange([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-auto"
        >
          <Filter className="mr-2 h-4 w-4" />
          <span>Kategoriler</span>
          {selectedCategories.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-sm px-1 font-normal"
            >
              {selectedCategories.length}
            </Badge>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[200px]">
        <Command>
          <CommandInput placeholder="Kategori ara..." />
          <CommandList>
            <CommandEmpty>Kategori bulunamadı.</CommandEmpty>
            <CommandGroup>
              {EVENT_CATEGORIES.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => handleToggleCategory(category)}
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
  );
}
