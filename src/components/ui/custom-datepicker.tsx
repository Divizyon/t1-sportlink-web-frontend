"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerWithPresetsProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

export function DatePickerWithPresets({
  className,
  selected,
  onSelect,
}: DatePickerWithPresetsProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected)

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onSelect?.(newDate)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        locale={tr}
        className="rounded-md border"
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSelect(new Date())}
        >
          Bugün
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSelect(addDays(new Date(), 1))}
        >
          Yarın
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSelect(addDays(new Date(), 7))}
        >
          Bir Hafta
        </Button>
      </div>
    </div>
  )
} 