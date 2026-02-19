"use client";

import { Wallet, CreditCard, Banknote, Landmark } from "lucide-react";
import { Account } from "@repo/shared";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";

interface DashboardAccountSummaryProps {
  accounts: Account[];
  className?: string;
}

export function DashboardAccountSummary({ accounts, className }: DashboardAccountSummaryProps) {
  const { t } = useTranslation();
  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bank':
        return { icon: Landmark, color: "text-blue-500", bg: "bg-blue-50" };
      case 'cash':
        return { icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-50" };
      case 'card':
      case 'credit':
        return { icon: CreditCard, color: "text-rose-500", bg: "bg-rose-50" };
      default:
        return { icon: Wallet, color: "text-slate-500", bg: "bg-slate-50" };
    }
  };

  return (
    <div className={cn("bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('accounts.title')}</h3>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
          {accounts.length} {t('accounts.active')}
        </span>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => {
          const { icon: Icon, color, bg } = getAccountIcon(account.type);
          return (
            <div
              key={account.id}
              className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
            >
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform group-hover:scale-110", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {account.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 capitalize">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(`accounts.${account.type.toLowerCase() as any}`)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-slate-900 font-mono">
                  $0.00
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
