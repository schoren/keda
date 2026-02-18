"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, parse } from "date-fns";
import { es } from "date-fns/locale";

interface MonthNavigatorProps {
  readonly month: string; // "YYYY-MM" format
  readonly onMonthChange: (month: string) => void;
}

function parseMonth(month: string): Date {
  return parse(month, "yyyy-MM", new Date());
}

function formatMonth(date: Date): string {
  return format(date, "yyyy-MM");
}

function isCurrentMonth(month: string): boolean {
  const now = new Date();
  return month === format(now, "yyyy-MM");
}

export function MonthNavigator({ month, onMonthChange }: MonthNavigatorProps) {
  const date = parseMonth(month);
  const displayName = format(date, "MMMM yyyy", { locale: es });
  const disableNext = isCurrentMonth(month);

  const handlePrev = () => {
    onMonthChange(formatMonth(subMonths(date, 1)));
  };

  const handleNext = () => {
    if (!disableNext) {
      onMonthChange(formatMonth(addMonths(date, 1)));
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-white/5 rounded-full px-2 py-1">
      <button
        onClick={handlePrev}
        aria-label="Mes anterior"
        className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="min-w-[160px] text-center text-sm font-bold tracking-wider text-foreground uppercase">
        {displayName}
      </span>
      <button
        onClick={handleNext}
        disabled={disableNext}
        aria-label="Mes siguiente"
        className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
