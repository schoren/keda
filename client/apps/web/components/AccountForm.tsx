"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@repo/i18n";

import { Account } from "@repo/shared";

import { Account, AccountType } from "@repo/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountFormProps {
  onSuccess: (account: Account) => void;
  onCancel: () => void;
  account?: Account;
}

export function AccountForm({ onSuccess, onCancel, account }: AccountFormProps) {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const [name, setName] = useState(account?.name || "");
  const [type, setType] = useState<AccountType>(account?.type || "cash");
  const [brand, setBrand] = useState(account?.brand || "");
  const [bank, setBank] = useState(account?.bank || "");

  const mutation = useMutation({
    mutationFn: (data: Partial<Account>) => 
      account 
        ? api.updateAccount(account.id, data) 
        : api.createAccount(data),
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onSuccess(newAccount);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Account> = { type };
    if (type === "card") {
      if (brand) data.brand = brand;
      if (bank) data.bank = bank;
    } else {
      data.name = name;
    }
    mutation.mutate(data);
  };

  const isCash = type === "cash";
  const isCard = type === "card";
  const needsName = type === "bank";

  const cardBrands = ["Visa", "Mastercard", "Amex", "Discover"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
          {t('forms.account.type_label')}
        </label>
        <Select 
          value={type} 
          onValueChange={(val) => setType(val as AccountType)}
          disabled={isCash && !!account}
        >
          <SelectTrigger className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            <SelectValue placeholder={t('forms.account.type_label')} />
          </SelectTrigger>
          <SelectContent position="popper" className="rounded-xl border-slate-100">
            <SelectItem value="cash">{t('accounts.cash')}</SelectItem>
            <SelectItem value="card">{t('accounts.card')}</SelectItem>
            <SelectItem value="bank">{t('accounts.bank')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCard && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
              {t('forms.account.brand_label')}
            </label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                <SelectValue placeholder={t('forms.account.brand_placeholder')} />
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-xl border-slate-100">
                {cardBrands.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
              {t('forms.account.bank_label')}
            </label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder={t('forms.account.bank_placeholder')}
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {needsName && (
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
            {t('forms.account.name_label')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('forms.account.name_placeholder')}
            required
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-sm"
        >
          {mutation.isPending 
            ? t('forms.account.creating') 
            : (account ? t('common.save') : t('forms.account.create'))}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="h-12 px-6 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          {t('common.cancel')}
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500 font-medium text-center">Error: {(mutation.error as Error).message}</p>
      )}
    </form>
  );
}
