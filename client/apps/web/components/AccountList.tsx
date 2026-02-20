"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Landmark, CreditCard, Wallet, Edit2, Trash2, HelpCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";
import { Account, AccountType } from "@repo/shared";
import { useState } from "react";
import { Modal } from "./Modal";
import { AccountForm } from "./AccountForm";
import { Button } from "./ui/button";

const iconMap: Record<AccountType, LucideIcon> = {
  cash: Wallet,
  card: CreditCard,
  bank: Landmark,
};

const colorMap: Record<AccountType, string> = {
  cash: "bg-emerald-100 text-emerald-600",
  card: "bg-violet-100 text-violet-600",
  bank: "bg-blue-100 text-blue-600",
};

export function AccountList() {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t('accounts.delete_confirm'))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-sm font-black text-slate-400 uppercase tracking-widest p-8 text-center">{t('common.loading')}</div>;
  if (error) return <div className="text-sm font-black text-red-400 uppercase tracking-widest p-8 text-center">{t('common.error')}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((account) => {
          const Icon = iconMap[account.type] || HelpCircle;
          const isCash = account.type === "cash";

          return (
            <div 
              key={account.id} 
              className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className={cn(
                "w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                colorMap[account.type] || colorMap.other
              )}>
                <Icon size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                  {t(`accounts.${account.type}`)}
                </span>
                <p className="text-base font-bold text-slate-900 truncate">
                  {account.display_name}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setEditingAccount(account)}
                  className="rounded-full text-slate-400 hover:text-emerald-600"
                  disabled={isCash}
                >
                  <Edit2 size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(account.id)}
                  className="rounded-full text-slate-400 hover:text-red-600"
                  disabled={isCash}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {accounts?.length === 0 && (
        <div className="bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            {t('accounts.no_accounts')}
          </p>
        </div>
      )}

      <Modal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title={t('accounts.edit_account')}
      >
        {editingAccount && (
          <AccountForm
            account={editingAccount}
            onSuccess={() => setEditingAccount(null)}
            onCancel={() => setEditingAccount(null)}
          />
        )}
      </Modal>
    </div>
  );
}
