"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";

interface SummaryProps {
  month: string;
  householdId: string;
}

export function Summary({ month, householdId }: SummaryProps) {
  const { t } = useTranslation();
  const api = useApi();

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ["summary", householdId, month],
    queryFn: () => api.getSummary(month),
    enabled: !!householdId,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-border p-5 animate-pulse">
        <div className="h-4 bg-accent rounded w-32 mb-3" />
        <div className="h-8 bg-accent rounded w-48 mb-2" />
        <div className="h-2 bg-accent rounded w-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-border p-5">
        <p className="text-sm text-destructive">{t('summary.error_loading')}</p>
      </div>
    );
  }
  if (!summary) return null;

  const percent = summary.total_budget > 0
    ? Math.min(100, (summary.total_spent / summary.total_budget) * 100)
    : 0;

  const remaining = summary.total_budget - summary.total_spent;

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        {t('summary.monthly_budget')}
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">
              ${summary.total_spent.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400">
              / ${summary.total_budget.toLocaleString()}
            </span>
          </div>

          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
            percent > 90
              ? "bg-red-50 text-red-500"
              : "bg-emerald-50 text-emerald-500"
          )}>
            {t('summary.spent_percentage', { percent: Math.round(percent) })}
          </div>
        </div>

        {/* Progress Bar - Large focal point */}
        <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              percent > 90 ? "bg-red-500" : "bg-emerald-500"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>

        {remaining < 0 && (
          <p className="text-xs font-bold text-red-500 text-center">
            {t('summary.exceeded_by', { amount: Math.abs(remaining).toLocaleString() })}
          </p>
        )}
      </div>
    </div>
  );
}
