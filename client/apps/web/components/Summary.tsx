"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SummaryProps {
  month: string;
  householdId: string;
}

export function Summary({ month, householdId }: SummaryProps) {
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
        <p className="text-sm text-destructive">Error al cargar el resumen</p>
      </div>
    );
  }
  if (!summary) return null;

  const percent = summary.total_budget > 0
    ? Math.min(100, (summary.total_spent / summary.total_budget) * 100)
    : 0;

  const remaining = summary.total_budget - summary.total_spent;

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        Presupuesto Mensual
      </p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-foreground">
          ${summary.total_spent.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">
          / ${summary.total_budget.toLocaleString()}
        </span>
        <div className="flex-1" />
        <span className={cn(
          "text-xs font-semibold px-2 py-0.5 rounded-full",
          percent > 90
            ? "bg-red-100 text-red-700"
            : "bg-keda-green-light text-keda-green-dark"
        )}>
          {Math.round(percent)}% gastado
        </span>
      </div>
      <Progress value={percent} className="h-2" />
      <p className={cn(
        "text-sm mt-2 font-medium",
        remaining >= 0 ? "text-keda-green" : "text-destructive"
      )}>
        {remaining >= 0
          ? `Te quedan $${remaining.toLocaleString()} este mes`
          : `Te has pasado por $${Math.abs(remaining).toLocaleString()}`}
      </p>
    </div>
  );
}
