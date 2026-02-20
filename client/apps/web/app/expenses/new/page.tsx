"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@repo/i18n";

export default function NewExpensePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSuccess = () => {
    // Redirect to transactions list or dashboard
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-white md:bg-slate-50">
      <TopBar />
      <div className="flex-1 overflow-hidden">
        <div className="md:container mx-auto md:py-10 px-0 md:px-4 max-w-5xl h-full flex flex-col">
          <h1 className="hidden md:block text-2xl md:text-3xl font-bold text-slate-900 mb-8 px-4 md:px-0">
            {t('forms.transaction.new_expense')}
          </h1>
          <div className="flex-1 overflow-hidden">
            <ExpenseForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
