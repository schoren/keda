"use client";

import { useState } from "react";
import { useApi } from "../providers";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@repo/i18n";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BudgetListItem } from "@/components/BudgetListItem";
import { Modal } from "@/components/Modal";
import { BudgetForm } from "@/components/BudgetForm";
import { Category } from "@repo/shared";

export default function BudgetsPage() {
  const { t } = useTranslation();
  const { householdId, isAuthenticated } = useAuth();
  const api = useApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", householdId],
    queryFn: () => api.getCategories(),
    enabled: !!householdId,
  });

  if (!isAuthenticated) return null;

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
        <header className="px-6 pt-10 pb-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                {t('nav.budgets')}
              </p>
              <h1 className="text-2xl font-black text-slate-900 leading-none">
                {t('nav.budgets')}
              </h1>
            </div>
            <Button 
              onClick={handleCreate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-4 h-10 shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.add')}</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-6 pb-24 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category) => (
                <BudgetListItem 
                  key={category.id} 
                  category={category} 
                  onEdit={handleEdit}
                />
              ))}

              {/* Add New Placeholder */}
              <button 
                onClick={handleCreate}
                className="flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-8 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all text-slate-400 hover:text-emerald-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">{t('common.add')}</span>
              </button>
            </div>
          )}
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingCategory ? t('forms.budget.edit') : t('forms.budget.create')}
        >
          <BudgetForm 
            category={editingCategory}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
