"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";
import { getBudgetStatus, BudgetStatus } from "@repo/shared";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  icon?: string;
}

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const { t } = useTranslation();
  const remaining = category.budget - category.spent;
  
  // Life bar should DEPLETE as spending increases
  const lifePercent = category.budget > 0 
    ? Math.max(0, Math.min(100, (remaining / category.budget) * 100))
    : 0;
  
  const status = getBudgetStatus(category.budget, category.spent);

  const statusColors = {
    [BudgetStatus.Success]: "bg-emerald-500",
    [BudgetStatus.Warning]: "bg-amber-500",
    [BudgetStatus.Danger]: "bg-red-500",
  };

  const statusBgColors = {
    [BudgetStatus.Success]: "bg-emerald-50 text-emerald-500",
    [BudgetStatus.Warning]: "bg-amber-50 text-amber-500",
    [BudgetStatus.Danger]: "bg-red-50 text-red-500",
  };

  // Resolve icon
  const IconComponent = (category.icon && (Icons as any)[category.icon]) || Icons.Tag; // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <Link 
      href={`/expenses/new?categoryId=${category.id}`}
      className={cn(
        "group relative flex flex-col gap-4 p-5 bg-white rounded-[24px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all overflow-hidden cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-2xl transition-colors",
          statusBgColors[status]
        )}>
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mb-0.5">
              {category.name}
            </h4>
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-2xl font-black font-mono tracking-tight",
                status === BudgetStatus.Danger ? "text-red-500" : "text-slate-900"
              )}>
                ${Math.max(0, remaining).toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                {t('dashboard.left')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Life Bar Container */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out rounded-full",
            statusColors[status]
          )}
          style={{ width: `${lifePercent}%` }}
        />
      </div>
    </Link>
  );
}
