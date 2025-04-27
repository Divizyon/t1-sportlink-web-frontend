import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export interface EventFiltersProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: EventFilterValues) => void;
  searchValue: string;
  sports?: string[];
  locations?: string[];
}

export interface EventFilterValues {
  date?: Date | null;
  sport?: string | null;
  location?: string | null;
  minParticipants?: number | null;
  maxParticipants?: number | null;
}

export function EventFilters({
  onSearchChange,
  onFilterChange,
  searchValue,
  sports = [],
  locations = [],
}: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [sport, setSport] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [minParticipants, setMinParticipants] = useState<number | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<number | null>(null);

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    applyFilters({ date });
  };

  const handleSportChange = (value: string) => {
    const newSport = value === "all" ? null : value;
    setSport(newSport);
    applyFilters({ sport: newSport });
  };

  const handleLocationChange = (value: string) => {
    const newLocation = value === "all" ? null : value;
    setLocation(newLocation);
    applyFilters({ location: newLocation });
  };

  const handleMinParticipantsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value);
    setMinParticipants(value);
    applyFilters({ minParticipants: value });
  };

  const handleMaxParticipantsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value);
    setMaxParticipants(value);
    applyFilters({ maxParticipants: value });
  };

  const applyFilters = (newFilters: Partial<EventFilterValues>) => {
    onFilterChange({
      date: newFilters.date !== undefined ? newFilters.date : date,
      sport: newFilters.sport !== undefined ? newFilters.sport : sport,
      location:
        newFilters.location !== undefined ? newFilters.location : location,
      minParticipants:
        newFilters.minParticipants !== undefined
          ? newFilters.minParticipants
          : minParticipants,
      maxParticipants:
        newFilters.maxParticipants !== undefined
          ? newFilters.maxParticipants
          : maxParticipants,
    });
  };

  const resetFilters = () => {
    setDate(null);
    setSport(null);
    setLocation(null);
    setMinParticipants(null);
    setMaxParticipants(null);
    onFilterChange({
      date: null,
      sport: null,
      location: null,
      minParticipants: null,
      maxParticipants: null,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (date) count++;
    if (sport) count++;
    if (location) count++;
    if (minParticipants !== null) count++;
    if (maxParticipants !== null) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Etkinlik ara... (İsim, kategori, konum)"
          className="pl-9"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters button and counter */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-4 w-4" />
          <span>Filtreler</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Filtreleri Temizle
          </Button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
          {/* Date filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tarih</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: tr }) : "Tarih seçin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(selectedDate) => {
                    handleDateChange(selectedDate || null);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sport filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Spor</label>
            <Select value={sport || "all"} onValueChange={handleSportChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tüm Sporlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Sporlar</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Konum</label>
            <Select
              value={location || "all"}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tüm Konumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Konumlar</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Participants filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Katılımcı Sayısı</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                className="w-full"
                value={minParticipants === null ? "" : minParticipants}
                onChange={handleMinParticipantsChange}
                min={0}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                className="w-full"
                value={maxParticipants === null ? "" : maxParticipants}
                onChange={handleMaxParticipantsChange}
                min={0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
