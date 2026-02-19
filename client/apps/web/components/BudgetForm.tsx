"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@repo/i18n";
import { Category } from "@repo/shared";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const AVAILABLE_ICONS = [
  "Utensils", "Car", "Gamepad2", "ShoppingBag", "Home", 
  "Heart", "Briefcase", "GraduationCap", "Gift", "PawPrint", 
  "Tv", "Zap", "Tag", "Coffee", "ShoppingBasket", 
  "Plane", "Wine", "Dumbbell"
];

export function BudgetForm({ category, onSuccess, onCancel }: BudgetFormProps) {
  const { t, i18n } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const [name, setName] = useState(category?.name || "");
  const [icon, setIcon] = useState(category?.icon || "Tag");

  // Numeric formatting logic
  const locale = i18n.language || 'es';
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [displayBudget, setDisplayBudget] = useState(() => {
    if (!category?.monthly_budget) return "";
    return formatter.format(category.monthly_budget);
  });

  const [rawBudget, setRawBudget] = useState(category?.monthly_budget || 0);

  const handleBudgetChange = (val: string) => {
    // Determine decimal separator for current locale
    const decimalSeparator = formatter.formatToParts(1.1).find(p => p.type === 'decimal')?.value || '.';
    const thousandSeparator = formatter.formatToParts(1000).find(p => p.type === 'group')?.value || ',';

    // Remove everything except digits and the decimal separator
    const cleanValue = val.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
    
    // Split into integer and decimal parts
    const parts = cleanValue.split(decimalSeparator);
    const integerPart = parts[0] || '';
    const decimalPart = parts.length > 1 ? parts[1] : null;

    // Parse for raw value (always use dot for JS float)
    const normalizedValue = cleanValue.replace(decimalSeparator, '.');
    const parsed = parseFloat(normalizedValue);

    if (cleanValue === '') {
      setRawBudget(0);
      setDisplayBudget("");
      return;
    }

    setRawBudget(isNaN(parsed) ? 0 : parsed);

    // Format integer part with thousand separators
    const formattedInteger = integerPart ? parseInt(integerPart, 10).toLocaleString(locale) : '';
    
    // Construct display value
    let newDisplay = formattedInteger;
    if (decimalPart) {
      newDisplay += decimalSeparator + decimalPart.slice(0, 2); // Limit to 2 decimals
    }
    
    setDisplayBudget(newDisplay);
  };

  const mutation = useMutation({
    mutationFn: (data: Partial<Category>) => 
      category 
        ? api.updateCategory(category.id, data) 
        : api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      monthly_budget: rawBudget,
      icon,
      is_active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="budget-form" className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="category_name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
            {t('forms.budget.name_label')}
          </label>
          <input
            id="category_name"
            name="category_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('forms.budget.name_placeholder')}
            required
            autoFocus
            className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="budget" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
            {t('forms.budget.amount_label')}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input
              id="budget"
              type="text"
              inputMode="decimal"
              value={displayBudget}
              onChange={(e) => handleBudgetChange(e.target.value)}
              placeholder={t('forms.budget.amount_placeholder')}
              required
              className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 pl-8 pr-4 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
            {t('forms.budget.icon_label')}
          </label>
          <div className="grid grid-cols-6 gap-2 bg-slate-50 p-3 rounded-[24px] border border-slate-100">
            {AVAILABLE_ICONS.map((iconName) => {
              const IconComp = (Icons as any)[iconName];
              const isSelected = icon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all",
                    isSelected 
                      ? "bg-emerald-500 text-white shadow-sm scale-110" 
                      : "bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-100"
                  )}
                >
                  <IconComp size={18} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-sm transition-all"
        >
          {mutation.isPending 
            ? (category ? t('forms.budget.editing') : t('forms.budget.creating'))
            : (category ? t('common.save') : t('forms.budget.create'))}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full h-10 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {t('common.cancel')}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-xs font-bold text-red-500 text-center bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
          Error: {(mutation.error as any).message}
        </p>
      )}
    </form>
  );
}
