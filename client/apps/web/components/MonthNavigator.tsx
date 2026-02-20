"use client";

import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { format, addMonths, subMonths, parse } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "@repo/i18n";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import Link from "next/link";

interface MonthNavigatorProps {
  readonly month: string; // "YYYY-MM" format
  readonly onMonthChange: (month: string) => void;
  readonly variant?: "default" | "minimal";
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

export function MonthNavigator({ month, onMonthChange, variant = "default" }: MonthNavigatorProps) {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const date = parseMonth(month);

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.getRecommendations(),
  });

  const hasRecommendations = recommendations && recommendations.length > 0;

  const dateLocale = i18n.language.startsWith('es') ? es : enUS;
  const displayName = format(date, variant === "minimal" ? "MMM yyyy" : "MMMM yyyy", { locale: dateLocale });
  const disableNext = isCurrentMonth(month);

  const handlePrev = () => {
    onMonthChange(formatMonth(subMonths(date, 1)));
  };

  const handleNext = () => {
    if (!disableNext) {
      onMonthChange(formatMonth(addMonths(date, 1)));
    }
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-between w-full pl-8">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label={t('month_navigator.prev')}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[100px] text-center text-[10px] font-black tracking-widest text-slate-900 uppercase">
            {displayName}
          </span>
          <button
            onClick={handleNext}
            disabled={disableNext}
            aria-label={t('month_navigator.next')}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 disabled:opacity-20"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="w-10 flex justify-end">
          {hasRecommendations && (
            <Link href="/recommendations" className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
              <div className="p-1 bg-emerald-50 rounded-full text-emerald-500 relative z-10 border border-emerald-100">
                <Lightbulb size={14} className="fill-emerald-500/20" />
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 bg-white/50 dark:bg-white/5 rounded-full px-2 py-1 relative min-w-[300px]">
      <button
        onClick={handlePrev}
        aria-label={t('month_navigator.prev')}
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
        aria-label={t('month_navigator.next')}
        className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute right-3 flex items-center">
        {hasRecommendations && (
          <Link href="/recommendations" className="relative group">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
            <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600 relative z-10 group-hover:bg-emerald-200 transition-colors border border-emerald-200">
              <Lightbulb size={16} className="fill-emerald-600/20" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
