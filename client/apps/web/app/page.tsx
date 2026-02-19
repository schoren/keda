"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "./providers";
import { useTranslation } from "@repo/i18n";
import { Summary } from "@/components/Summary";
import { DashboardLayout } from "@/components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { MonthNavigator } from "@/components/MonthNavigator";
import { CategoryGrid } from "@/components/CategoryGrid";
import { cn } from "@/lib/utils";

export default function Home() {
  const { t } = useTranslation();
  const { householdId, login, isAuthenticated, isLoading } = useAuth();

  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-keda-green/30 border-t-keda-green rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && householdId) {
    return (
      <DashboardLayout 
        headerContent={
          <MonthNavigator month={month} onMonthChange={setMonth} variant="minimal" />
        }
      >
        <DashboardContent month={month} householdId={householdId} />
      </DashboardLayout>
    );
  }

  // Login page
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-keda-green to-emerald-400 bg-clip-text text-transparent">
            {t('login.title')}
          </h1>
          <p className="text-slate-300 mt-2">{t('login.subtitle')}</p>
        </div>

        <div>
          <p className="text-white/80 text-sm mb-4">
            {t('login.description')}
          </p>
          <button
            onClick={() => login()}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors"
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            {t('login.continue_with_google')}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardContent({
  month,
  householdId,
}: {
  month: string;
  householdId: string;
}) {
  const { t } = useTranslation();
  const api = useApi();

  const { data: summary } = useQuery({
    queryKey: ["summary", householdId, month],
    queryFn: () => api.getSummary(month),
    enabled: !!householdId,
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full text-left pb-32">
      {/* Desktop Summary - Visible ONLY on desktop, at the top */}
      <div className="hidden md:block">
        <Summary month={month} householdId={householdId} />
      </div>

      {/* Categories Section - Maximized View */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('dashboard.categories_to_spend')}</h2>
        </div>

        {summary?.categories && (
          <CategoryGrid categories={summary.categories} />
        )}
      </section>

      {/* Slim Fixed Bottom Summary for Mobile ONLY */}
      <div className="md:hidden">
        <SlimSummary summary={summary} />
      </div>
    </div>
  );
}

function SlimSummary({ summary }: { summary: any }) {
  const { t } = useTranslation();
  if (!summary) return null;

  const percent = summary.total_budget > 0
    ? Math.min(100, (summary.total_spent / summary.total_budget) * 100)
    : 0;
  
  const lifePercent = 100 - percent;
  const isOver = summary.total_spent > summary.total_budget;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 pb-safe-area-inset-bottom shadow-lg">
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={cn(
              "text-lg font-black font-mono",
              isOver ? "text-red-500" : "text-slate-900"
            )}>
              ${(summary.total_budget - summary.total_spent).toLocaleString()}
            </span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {t('dashboard.left')}
            </span>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            ${summary.total_spent.toLocaleString()} / ${summary.total_budget.toLocaleString()}
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-out rounded-full",
              isOver ? "bg-red-500" : percent > 80 ? "bg-amber-500" : "bg-emerald-500"
            )}
            style={{ width: `${lifePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
