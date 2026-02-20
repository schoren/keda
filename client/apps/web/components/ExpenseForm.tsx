"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/app/providers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NumericKeypad } from "./NumericKeypad";
import { DynamicAmountDisplay } from "./DynamicAmountDisplay";
import { AccountSelector } from "./AccountSelector";
import { CategorySelector } from "./CategorySelector";
import { DatePicker } from "./DatePicker";
import { NoteInput } from "./NoteInput";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, ChevronDown } from "lucide-react";
import { useTranslation } from "@repo/i18n";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { Transaction } from "@repo/shared";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");

  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState(categoryIdFromUrl || "");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState("");
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Fetch accounts to default to the first one
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  // Default to first account
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  // Fetch summary to get category balance
  const { data: summary } = useQuery({
    queryKey: ["summary", format(date, "yyyy-MM")],
    queryFn: () => api.getSummary(format(date, "yyyy-MM")),
  });

  const categoryData = summary?.categories.find((c) => c.id === categoryId);
  const remaining = categoryData?.remaining ?? 0;
  const projected = remaining - (parseFloat(amount) || 0);

  const createTransaction = useMutation({
    mutationFn: (data: Partial<Transaction>) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      onSuccess?.();
    },
  });

  const handleSubmit = () => {
    if (!amount || !accountId || !categoryId) return;

    createTransaction.mutate({
      amount: Math.abs(parseFloat(amount)),
      account_id: accountId,
      category_id: categoryId,
      date: date.toISOString(),
      note,
      type: "expense",
    });
  };

  const isFormValid = !!(amount && parseFloat(amount) > 0 && accountId && categoryId);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 md:p-0"
        onScroll={handleScroll}
      >
        <div className="flex flex-col md:flex-row flex-wrap gap-8 max-w-4xl mx-auto pb-32 md:pb-0">
          {/* Left Column: Amount & Keypad */}
          <div className="flex-1 min-w-[320px] flex flex-col gap-6 items-center md:items-start">
            <div className="text-center md:text-left w-full space-y-4">
              {/* Budget Impact */}
              {categoryId && (
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.left')}</span>
                    <span className="text-sm font-black font-mono text-slate-600">${remaining.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected</span>
                    <span className={cn(
                      "text-sm font-black font-mono",
                      projected < 0 ? "text-red-500" : "text-emerald-500"
                    )}>${projected.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="md:hidden">
                <DynamicAmountDisplay value={amount} />
              </div>
            </div>

            <div className="w-full md:max-w-none max-w-xs mx-auto md:mx-0">
              <NumericKeypad value={amount} onChange={setAmount} />
            </div>
          </div>

          {/* Right Column: Form Details */}
          <div className="flex-1 min-w-[320px] flex flex-col gap-6 w-full">
            <div className="space-y-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              {!categoryIdFromUrl && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.transaction.category_label')}</label>
                  <CategorySelector value={categoryId} onChange={setCategoryId} month={format(date, "yyyy-MM")} />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.transaction.account_label')}</label>
                <AccountSelector value={accountId} onChange={setAccountId} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.transaction.date_label')}</label>
                <DatePicker value={date} onChange={setDate} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('forms.transaction.note_label')}</label>
                <NoteInput value={note} onChange={setNote} categoryId={categoryId} />
              </div>
            </div>

            {/* Desktop Only Button */}
            <div className="hidden md:block">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || createTransaction.isPending}
                className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-600/20"
              >
                {createTransaction.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t('forms.transaction.save_expense')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Area */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-50/90 backdrop-blur-sm border-t border-slate-100 pointer-events-none">
        <div className="max-w-md mx-auto relative pointer-events-auto">
          {showScrollIndicator && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-slate-400">
              <span className="text-[8px] font-bold uppercase tracking-widest">More options</span>
              <ChevronDown size={16} />
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || createTransaction.isPending}
            className="w-full h-16 text-lg font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] shadow-xl shadow-emerald-600/30 disabled:opacity-100 disabled:bg-emerald-600/50"
          >
            {createTransaction.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : t('forms.transaction.save_expense')}
          </Button>
        </div>
      </div>
    </div>
  );
}
