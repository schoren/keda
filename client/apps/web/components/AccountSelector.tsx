"use client";

import { useApi } from "@/app/providers";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CreditCard, Landmark } from "lucide-react";
import { AccountType } from "@repo/shared";

interface AccountSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const iconMap: Record<AccountType | string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  cash: Wallet,
  card: CreditCard,
  bank: Landmark,
};

export function AccountSelector({ value, onChange }: AccountSelectorProps) {
  const api = useApi();
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 rounded-xl bg-white border-slate-200">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => {
          const Icon = iconMap[account.type] || Wallet;
          return (
            <SelectItem key={account.id} value={account.id} className="py-3">
              <div className="flex items-center gap-3">
                <Icon className="text-slate-500" size={20} />
                <span className="font-medium text-slate-900">
                  {account.display_name || account.name}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
