"use client";

import { useApi } from "@/app/providers";
import { formatMoney } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  month?: string;
}

export function CategorySelector({ value, onChange, month }: CategorySelectorProps) {
  const api = useApi();
  const currentMonth = month || format(new Date(), "yyyy-MM");

  const { data } = useQuery({
    queryKey: ["summary", currentMonth],
    queryFn: () => api.getSummary(currentMonth),
  });

  const categories = data?.categories || [];
  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 rounded-xl bg-white border-slate-200">
        <SelectValue placeholder="Select category">
          {selectedCategory && (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-medium text-slate-900 truncate">
                {selectedCategory.name}
              </span>
              <span
                className={`text-sm font-medium ${selectedCategory.remaining < 0 ? "text-red-500" : "text-green-600"
                  }`}
              >
                {Math.round(selectedCategory.remaining)}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id} className="py-3">
            <div className="flex items-center justify-between w-full gap-4">
              <span className="font-medium text-slate-900 truncate">
                {category.name}
              </span>
              <span
                className={`text-sm font-medium ${category.remaining < 0 ? "text-red-500" : "text-slate-500"
                  }`}
              >
                {Math.round(category.remaining)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
