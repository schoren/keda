"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { useTranslation } from "@repo/i18n";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../providers";
import { useAuth } from "@/hooks/useAuth";

export default function NewExpensePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const api = useApi();
  const { householdId } = useAuth();

  const { data: summary = null } = useQuery({
    queryKey: ["summary", householdId, new Date().toISOString().slice(0, 7)],
    queryFn: () => api.getSummary(new Date().toISOString().slice(0, 7)),
    enabled: !!householdId,
  });

  const handleSuccess = () => {
    // Redirect to transactions list or dashboard
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-white md:bg-slate-50">
      <TopBar summary={summary} />
      
      {/* Mobile Header with Back Button */}
      <div className="md:hidden flex items-center h-16 px-4 bg-white border-b border-slate-100 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="mr-2 text-slate-600 rounded-full"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-bold text-slate-900">
          {t('forms.transaction.new_expense')}
        </h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="md:container mx-auto md:py-10 px-0 md:px-4 max-w-5xl h-full flex flex-col">
          <div className="hidden md:flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="text-slate-600 rounded-full"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {t('forms.transaction.new_expense')}
            </h1>
          </div>
          <div className="flex-1 overflow-hidden">
            <ExpenseForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
