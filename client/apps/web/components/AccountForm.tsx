"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@repo/i18n";

import { Account } from "@repo/shared";

interface AccountFormProps {
  onSuccess: (account: Account) => void;
  onCancel: () => void;
}

export function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "card" | "bank">("cash");

  const mutation = useMutation({
    mutationFn: (data: any) => api.createAccount(data), // eslint-disable-line @typescript-eslint/no-explicit-any
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onSuccess(newAccount);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          {t('forms.account.name_label')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('forms.account.name_placeholder')}
          required
          autoFocus
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          {t('forms.account.type_label')}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
          required
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="cash">{t('accounts.cash')}</option>
          <option value="card">{t('accounts.card')}</option>
          <option value="bank">{t('accounts.bank')}</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-keda-green hover:bg-keda-green-dark text-white"
        >
          {mutation.isPending ? t('forms.account.creating') : t('forms.account.create')}
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
        <p className="text-sm text-destructive">Error: {(mutation.error as any).message}</p> // eslint-disable-line @typescript-eslint/no-explicit-any
      )}
    </form>
  );
}
