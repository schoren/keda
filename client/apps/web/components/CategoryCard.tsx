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
  const progress = Math.min((category.spent / category.budget) * 100, 100);
  
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
        "group relative flex flex-col gap-3 p-5 bg-white rounded-[24px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all overflow-hidden cursor-pointer",
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
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest truncate mb-1">
              {category.name}
            </h4>
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-2xl font-black font-mono",
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

      {/* Progress Bar - Bottom slim style */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out",
            statusColors[status]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
