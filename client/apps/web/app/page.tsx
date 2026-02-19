"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "./providers";
import { Summary } from "@/components/Summary";
import { TopBar } from "@/components/TopBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { DashboardLayout } from "@/components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthNavigator } from "@/components/MonthNavigator";
import { RecommendationsBanner } from "@/components/RecommendationsBanner";
import { DashboardAccountSummary } from "@/components/DashboardAccountSummary";
import { RecentTransactions } from "@/components/RecentTransactions";
import { CategoryCard } from "@/components/CategoryCard";

export default function Home() {
  const { user, householdId, login, isAuthenticated, isLoading } = useAuth();

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
      <DashboardLayout>
        <DashboardContent month={month} onMonthChange={setMonth} householdId={householdId} user={user} />
      </DashboardLayout>
    );
  }

  // Login page
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-keda-green to-emerald-400 bg-clip-text text-transparent">
            Keda
          </h1>
          <p className="text-slate-300 mt-2">Finanzas familiares simplificadas</p>
        </div>

        <div>
          <p className="text-white/80 text-sm mb-4">
            Controla tus gastos con transparencia y facilidad.
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
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardContent({
  month,
  onMonthChange,
  householdId,
  user,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  householdId: string;
  user: any;
}) {
  const api = useApi();

  const { data: summary } = useQuery({
    queryKey: ["summary", householdId, month],
    queryFn: () => api.getSummary(month),
    enabled: !!householdId,
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
    enabled: !!householdId,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", month],
    queryFn: () => api.getTransactions(month),
    enabled: !!householdId,
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Premium Header - Stitch Inspired */}
      <header className="px-6 pt-10 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              {user?.picture_url ? (
                <Image src={user.picture_url} alt={user.name} width={48} height={48} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">HOLA,</p>
              <h1 className="text-lg font-black text-slate-900 leading-none">
                {user?.name?.split(" ")[0] || "Usuario"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-100">
          <MonthNavigator month={month} onMonthChange={onMonthChange} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-24 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Summary month={month} householdId={householdId} />
          {accounts && <DashboardAccountSummary accounts={accounts} />}
        </div>

        {/* Categories Section - Maximized View */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">CATEGORÍAS POR GASTAR</h2>
            <Link href="/budgets" className="text-[10px] font-black text-emerald-500 hover:underline">VER TODO</Link>
          </div>

          <RecommendationsBanner />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary?.categories && summary.categories.length > 0 ? (
              summary.categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))
            ) : (
              <div className="col-span-full bg-white rounded-[24px] border border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-400 font-bold mb-4">No hay categorías configuradas</p>
                <Link href="/budgets">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-6">
                    Empezar
                  </Button>
                </Link>
              </div>
            )}

            {/* Add New Quick Entry */}
            <Link
              href="/expenses/new"
              className="group flex items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-6 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all min-h-[100px]"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
              </div>
              <span className="text-sm font-black text-slate-400 group-hover:text-emerald-500">NUEVO GASTO</span>
            </Link>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">ACTIVIDAD RECIENTE</h2>
            <Link href="/transactions" className="text-[10px] font-black text-emerald-500 hover:underline">VER TODO</Link>
          </div>
          {transactions && <RecentTransactions transactions={transactions} />}
        </section>
      </main>
    </div>
  );
}
