"use client";

import { Transaction } from "@repo/shared";
import { format, isToday, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";

interface RecentTransactionsProps {
  transactions: Transaction[];
  className?: string;
}

export function RecentTransactions({ transactions, className }: RecentTransactionsProps) {
  const { t, i18n } = useTranslation();

  const dateLocale = i18n.language.startsWith('es') ? es : enUS;

  const formatGroupDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return t('common.today');
    if (isYesterday(date)) return t('common.yesterday');
    return format(date, i18n.language.startsWith('es') ? "EEEE, d 'de' MMMM" : "EEEE, MMMM do", { locale: dateLocale });
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const dateKey = transaction.date?.split("T")[0] || "unknown";
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <div className={cn("bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('transactions.title')}</h3>
        <Receipt className="w-5 h-5 text-slate-300" />
      </div>
      <div className="space-y-6">
        {sortedDates.map((dateKey) => {
          const dateTransactions = groupedTransactions[dateKey];
          if (!dateTransactions) return null;

          return (
            <div key={dateKey} className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-2">
                {formatGroupDate(dateKey)}
              </h4>
              <div className="space-y-1">
                {dateTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors",
                      transaction.amount < 0
                        ? "bg-slate-50 text-slate-400"
                        : "bg-emerald-50 text-emerald-500"
                    )}>
                      {transaction.amount < 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {transaction.note || t('common.no_description')}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {t('transactions.expense_in')} {transaction.category_id?.slice(0, 8) || t('transactions.category_placeholder')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-black font-mono",
                        transaction.amount < 0 ? "text-slate-900" : "text-emerald-500"
                      )}>
                        {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 italic">{t('transactions.no_activity')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
