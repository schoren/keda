"use client";

import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

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
  const remaining = category.budget - category.spent;
  const progress = Math.min((category.spent / category.budget) * 100, 100);
  const isOverBudget = category.spent > category.budget;

  // Resolve icon
  const IconComponent = (category.icon && (Icons as any)[category.icon]) || Icons.Tag;

  return (
    <div className={cn(
      "group relative flex flex-col gap-3 p-4 bg-white rounded-[24px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-2xl transition-colors",
          isOverBudget ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
        )}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {category.name}
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                RESTA
              </span>
              <span className={cn(
                "text-sm font-bold font-mono",
                isOverBudget ? "text-red-500" : "text-emerald-500"
              )}>
                ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu (Placeholder) */}
        <button className="p-1 px-2 text-slate-300 hover:text-slate-500 rounded-lg">
          <Icons.MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar - Bottom slim style */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50">
        <div
          className={cn(
            "h-full transition-all duration-500",
            isOverBudget ? "bg-red-500" : "bg-emerald-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
