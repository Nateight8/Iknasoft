"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse the date string to a Date object, or use null if invalid
  const date = value && isValid(parseISO(value)) ? parseISO(value) : undefined;
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format the date as ISO string (YYYY-MM-DD)
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty input or valid date format
    if (!inputValue || /^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleInputBlur = () => {
    // Validate the input on blur
    if (value && !isValid(parseISO(value))) {
      // If invalid, revert to the last valid date or clear
      onChange(date ? format(date, "yyyy-MM-dd") : "");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal h-8 px-2 py-1",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? (
            format(date, "MMM dd, yyyy")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
} 