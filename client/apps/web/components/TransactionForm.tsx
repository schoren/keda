"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    mutation.mutate({
      amount: type === "expense" ? -Math.abs(numAmount) : Math.abs(numAmount),
      note,
      date: new Date(date as string).toISOString(),
      category_id: categoryId,
      account_id: accountId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selector */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          type="button"
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors",
            type === "expense"
              ? "bg-red-50 text-red-600 border-r border-border"
              : "text-muted-foreground hover:bg-accent border-r border-border"
          )}
          onClick={() => setType("expense")}
        >
          {t('forms.transaction.type_expense')}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 py-2.5 text-sm font-medium transition-colors",
            type === "income"
              ? "bg-green-50 text-keda-green"
              : "text-muted-foreground hover:bg-accent"
          )}
          onClick={() => setType("income")}
        >
          {t('forms.transaction.type_income')}
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('forms.transaction.amount_label')}</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          autoFocus
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('forms.transaction.date_label')}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('forms.transaction.account_label')}</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('forms.transaction.account_placeholder')}</option>
          {accounts?.map((acc) => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('forms.transaction.category_label')}</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('forms.transaction.category_placeholder')}</option>
          {categories?.filter(c => c.is_active).map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('forms.transaction.note_label')}</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('forms.transaction.note_placeholder')}
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-keda-green hover:bg-keda-green-dark text-white"
        >
          {mutation.isPending ? t('forms.transaction.saving') : t('forms.transaction.save')}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
        >
          {t('common.cancel')}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">Error: {(mutation.error as any).message}</p>
      )}
    </form>
  );
}
