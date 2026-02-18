"use client";

import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  // Format Date to YYYY-MM-DD for input
  const dateString = value ? format(value, "yyyy-MM-dd") : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    // Parse YYYY-MM-DD to Date (local time)
    const date = parse(val, "yyyy-MM-dd", new Date());
    onChange(date);
  };

  return (
    <Input
      type="date"
      value={dateString}
      onChange={handleChange}
      className="h-14 rounded-xl bg-white border-slate-200 text-lg block w-full"
      aria-label="date"
    />
  );
}
