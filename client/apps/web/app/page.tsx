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

export default function Home() {
  const { user, householdId, login, isAuthenticated, isLoading } = useAuth();

  const currentMonth = new Date().toISOString().slice(0, 7);

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
        <DashboardContent month={currentMonth} householdId={householdId} user={user} />
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
  householdId,
  user,
}: {
  month: string;
  householdId: string;
  user: any;
}) {
  const api = useApi();

  const { data: summary } = useQuery({
    queryKey: ["summary", householdId, month],
    queryFn: () => api.getSummary(month),
    enabled: !!householdId,
  });

  return (
    <>
      {/* Desktop TopBar */}
      <TopBar summary={summary ?? null} />

      {/* Mobile Header */}
      <div className="md:hidden px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {user?.picture_url && (
              <Image
                src={user.picture_url}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-xs text-muted-foreground">
                Hola, {user?.name?.split(" ")[0]}
              </p>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Search size={20} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Budget Summary */}
        <Summary month={month} householdId={householdId} />
      </div>

      {/* Main Content */}
      <div className="px-5 md:px-8 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            <span className="hidden md:inline">Monthly Budget Categories</span>
            <span className="md:hidden">Categorías por Gastar</span>
          </h2>
          {/* Mobile: FAB for new expense */}
          <Link href="/expenses/new" className="md:hidden">
            <Button
              size="sm"
              className="bg-keda-green hover:bg-keda-green-dark text-white rounded-full w-10 h-10 p-0"
            >
              <Plus size={20} />
            </Button>
          </Link>
        </div>

        {/* Categories */}
        {summary?.categories && summary.categories.length > 0 ? (
          <CategoryGrid categories={summary.categories} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              No hay categorías configuradas aún.
            </p>
            <Link
              href="/budgets"
              className="text-sm text-keda-green hover:underline mt-2 inline-block"
            >
              Configurar presupuestos
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
