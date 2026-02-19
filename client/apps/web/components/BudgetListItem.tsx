"use client";

import { useTranslation } from "@repo/i18n";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2, Tag } from "lucide-react";
import * as Icons from "lucide-react";
import { Category } from "@repo/shared";

interface BudgetListItemProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function BudgetListItem({ category, onEdit, onDelete }: BudgetListItemProps) {
  const { t } = useTranslation();

  // Resolve icon
  const IconComponent = (category.icon && (Icons[category.icon as keyof typeof Icons] as React.ElementType)) || Tag;

  return (
    <div className="group relative bg-white p-5 rounded-[24px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all overflow-hidden flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-900">{category.name}</h3>
        </div>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-300 hover:text-slate-500">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {t('summary.monthly_budget')}
          </p>
          <p className="text-xl font-black font-mono text-slate-900">
            ${category.monthly_budget.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(category)}
            aria-label={t('common.edit')}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(category)}
            aria-label={t('common.delete')}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
