"use client";

import { useState } from "react";
import { useApi } from "@/app/providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NumPad } from "./NumPad";
import { AccountSelector } from "./AccountSelector";
import { CategorySelector } from "./CategorySelector";
import { DatePicker } from "./DatePicker";
import { NoteInput } from "./NoteInput";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@repo/i18n";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState("");

  const createTransaction = useMutation({
    mutationFn: (data: any) => api.createTransaction(data), // eslint-disable-line @typescript-eslint/no-explicit-any
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      onSuccess?.();
    },
  });

  const handleSubmit = () => {
    if (!amount || !accountId || !categoryId) return;

    createTransaction.mutate({
      amount: parseFloat(amount),
      account_id: accountId,
      category_id: categoryId,
      date: format(date, "yyyy-MM-dd"), // Assuming API expects YYYY-MM-DD string
      note,
      type: "expense",
    });
  };

  const isFormValid = !!(amount && parseFloat(amount) > 0 && accountId && categoryId);

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto p-4 md:p-8">
      {/* Left Column: Amount & NumPad (Desktop) / Top (Mobile) */}
      <div className="flex-1 flex flex-col gap-6 items-center md:items-start">
        <div className="text-center md:text-left w-full">
          <label className="text-sm font-medium text-slate-500 uppercase tracking-wider block mb-2">{t('forms.transaction.amount_label')}</label>
          <div className="text-5xl font-bold text-green-600 truncate bg-slate-50 p-4 rounded-2xl w-full text-center md:text-left">
            ${amount || "0"}
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto md:mx-0">
          <NumPad value={amount} onChange={setAmount} />
        </div>
      </div>

      {/* Right Column: Details Form */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forms.transaction.account_label')}</label>
            <AccountSelector value={accountId} onChange={setAccountId} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forms.transaction.category_label')}</label>
            <CategorySelector value={categoryId} onChange={setCategoryId} month={format(date, "yyyy-MM")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forms.transaction.date_label')}</label>
            <DatePicker value={date} onChange={setDate} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('forms.transaction.note_label')}</label>
            <NoteInput value={note} onChange={setNote} categoryId={categoryId} />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || createTransaction.isPending}
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20"
        >
          {createTransaction.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('forms.transaction.save_expense')}
        </Button>
      </div>
    </div>
  );
}
