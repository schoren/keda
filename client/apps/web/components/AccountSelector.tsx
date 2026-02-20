"use client";

import { useApi } from "@/app/providers";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CreditCard, Landmark, Plus } from "lucide-react";
import { AccountType } from "@repo/shared";
import { useState } from "react";
import { Modal } from "./Modal";
import { AccountForm } from "./AccountForm";
import { useTranslation } from "@repo/i18n";

interface AccountSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const iconMap: Record<AccountType | string, React.ComponentType<{ className?: string; size?: number }>> = {
  cash: Wallet,
  card: CreditCard,
  bank: Landmark,
};

export function AccountSelector({ value, onChange }: AccountSelectorProps) {
  const { t } = useTranslation();
  const api = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  const handleValueChange = (val: string) => {
    if (val === "ADD_NEW") {
      setIsModalOpen(true);
    } else {
      onChange(val);
    }
  };

  return (
    <>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-14 rounded-xl bg-white border-slate-200">
          <SelectValue placeholder={t('forms.transaction.account_placeholder')} />
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
          
          <SelectSeparator />
          
          <SelectItem value="ADD_NEW" className="py-3 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Plus size={20} />
              <span className="font-bold uppercase text-[10px] tracking-widest">
                {t('accounts.add_account')}
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('accounts.add_account')}
      >
        <AccountForm 
          onSuccess={(newAccount) => {
            onChange(newAccount.id);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
