"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NumPad } from "@/components/NumPad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Wallet,
  FileText,
  Utensils,
  Car,
  Gamepad2,
  ShoppingBag,
  Home,
  Heart,
  Briefcase,
  GraduationCap,
  Gift,
  PawPrint,
  Tv,
  Zap,
  Lock,
} from "lucide-react";
import Link from "next/link";

const categoryIcons: Record<string, { icon: React.ComponentType<any>; color: string; bg: string }> = {
  comida: { icon: Utensils, color: "text-white", bg: "bg-keda-green" },
  alimentación: { icon: Utensils, color: "text-white", bg: "bg-keda-green" },
  transporte: { icon: Car, color: "text-white", bg: "bg-blue-500" },
  ocio: { icon: Gamepad2, color: "text-white", bg: "bg-purple-500" },
  compras: { icon: ShoppingBag, color: "text-white", bg: "bg-emerald-500" },
  vivienda: { icon: Home, color: "text-white", bg: "bg-rose-500" },
  salud: { icon: Heart, color: "text-white", bg: "bg-green-500" },
  trabajo: { icon: Briefcase, color: "text-white", bg: "bg-slate-500" },
  educación: { icon: GraduationCap, color: "text-white", bg: "bg-indigo-500" },
  regalos: { icon: Gift, color: "text-white", bg: "bg-pink-500" },
  mascotas: { icon: PawPrint, color: "text-white", bg: "bg-amber-500" },
  servicios: { icon: Zap, color: "text-white", bg: "bg-yellow-500" },
  entretenimiento: { icon: Tv, color: "text-white", bg: "bg-violet-500" },
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase();
  return categoryIcons[key] ?? { icon: ShoppingBag, color: "text-white", bg: "bg-slate-500" };
}

export default function NewExpensePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-keda-green/30 border-t-keda-green rounded-full animate-spin" />
        </div>
      }>
        <NewExpenseContent />
      </Suspense>
    </DashboardLayout>
  );
}

function NewExpenseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = useApi();
  const queryClient = useQueryClient();
  const { householdId } = useAuth();

  const preselectedCategoryId = searchParams.get("categoryId") ?? "";

  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]!);
  const [categoryId, setCategoryId] = useState(preselectedCategoryId);
  const [accountId, setAccountId] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  const { data: summary } = useQuery({
    queryKey: ["summary", householdId, new Date().toISOString().slice(0, 7)],
    queryFn: () => api.getSummary(new Date().toISOString().slice(0, 7)),
    enabled: !!householdId,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      router.push("/");
    },
  });

  // Set default account
  if (accounts && accounts.length > 0 && !accountId) {
    setAccountId(accounts[0]!.id);
  }

  // Set default category if not preselected
  if (categories && categories.length > 0 && !categoryId) {
    const active = categories.filter((c) => c.is_active);
    if (active.length > 0) {
      setCategoryId(active[0]!.id);
    }
  }

  const selectedCategory = categories?.find((c) => c.id === categoryId);
  const categorySummary = summary?.categories?.find((c) => c.id === categoryId);
  const categoryBudget = categorySummary?.budget ?? selectedCategory?.monthly_budget ?? 0;
  const categorySpent = categorySummary?.spent ?? 0;
  const categoryRemaining = categorySummary?.remaining ?? categoryBudget;
  const categoryPercent = categoryBudget > 0
    ? Math.min(100, (categorySpent / categoryBudget) * 100)
    : 0;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || !categoryId || !accountId) return;

    mutation.mutate({
      amount: -Math.abs(numAmount),
      note,
      date: new Date(date).toISOString(),
      category_id: categoryId,
      account_id: accountId,
    });
  };

  const catIcon = selectedCategory ? getCategoryIcon(selectedCategory.name) : null;

  return (
    <>
      {/* ============== DESKTOP LAYOUT ============== */}
      <div className="hidden md:block">
        {/* Desktop Top Nav */}
        <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-keda-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Keda</span>
          </div>

          <nav className="flex items-center gap-6">
            {["Resumen", "Gastos", "Presupuestos", "Cuentas"].map((item) => (
              <Link
                key={item}
                href={item === "Resumen" ? "/" : item === "Gastos" ? "/transactions" : "#"}
                className={cn(
                  "text-sm font-medium pb-0.5 border-b-2 transition-colors",
                  item === "Gastos"
                    ? "text-foreground border-foreground"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="w-32" />
        </header>

        {/* Breadcrumb + Content */}
        <div className="max-w-2xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-keda-green hover:underline mb-6"
          >
            <ArrowLeft size={16} />
            Volver a Gastos
          </Link>

          {/* Category Context Card */}
          {selectedCategory && (
            <div className="bg-keda-green/5 border border-keda-green/20 rounded-lg p-4 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {catIcon && (
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", catIcon.bg)}>
                      <catIcon.icon size={20} className={catIcon.color} />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{selectedCategory.name}</p>
                    <p className="text-xs text-keda-green">Categoría Seleccionada</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    ${categoryRemaining.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Restante</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Consumido: ${categorySpent.toLocaleString()}</span>
              <span>Total: ${categoryBudget.toLocaleString()}</span>
            </div>
            <Progress value={categoryPercent} className="h-2" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-border p-8">
            {/* Amount */}
            <div className="text-center mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Monto del Gasto
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl text-muted-foreground">$</span>
                <input
                  type="number"
                  value={amount === "0" ? "" : amount}
                  onChange={(e) => setAmount(e.target.value || "0")}
                  placeholder="0.00"
                  className="text-5xl font-bold text-foreground text-center bg-transparent border-none outline-none w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Cuenta de Origen
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar cuenta</option>
                  {accounts?.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.display_name || acc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Fecha del Gasto
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Category selector */}
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar categoría</option>
                {categories?.filter((c) => c.is_active).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Notas / Descripción <span className="text-muted-foreground/60">(Opcional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej. Almuerzo con el equipo de diseño..."
                rows={3}
                className="w-full rounded-lg border border-border bg-accent/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={mutation.isPending || parseFloat(amount) <= 0}
                className="flex-1 bg-keda-green hover:bg-keda-green-dark text-white font-semibold h-12"
              >
                {mutation.isPending ? "Guardando..." : "Guardar Gasto"}
              </Button>
              <button
                onClick={() => router.push("/")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4"
              >
                Cancelar
              </button>
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive mt-3">
                Error: {(mutation.error as any).message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              ¿Necesitas cambiar la categoría?{" "}
              <button
                onClick={() => { }}
                className="text-keda-green hover:underline"
              >
                Seleccionar otra
              </button>
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground/60">
              <Lock size={12} />
              <span>Tus datos financieros están encriptados y seguros</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============== MOBILE LAYOUT ============== */}
      <div className="md:hidden min-h-screen bg-white flex flex-col">
        {/* Mobile Header */}
        <header className="flex items-center h-14 px-4 border-b border-border">
          <button
            onClick={() => router.push("/")}
            className="p-1.5 -ml-1.5"
          >
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-foreground">
            Nuevo Gasto
          </h1>
          <div className="w-8" />
        </header>

        <div className="flex-1 flex flex-col px-5 py-4">
          {/* Category Badge */}
          {selectedCategory && catIcon && (
            <div className="flex items-center gap-3 bg-accent/50 rounded-lg p-3 mb-5">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", catIcon.bg)}>
                <catIcon.icon size={18} className={catIcon.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {selectedCategory.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Presupuesto mensual
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-keda-green">
                  ${categoryRemaining.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Restante
                </p>
              </div>
            </div>
          )}

          {/* Amount Display */}
          <div className="text-center mb-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
              Monto a Ingresar
            </p>
            <p className="text-4xl font-bold text-keda-green">
              ${amount === "0" ? "0.00" : parseFloat(amount).toFixed(2)}
            </p>
          </div>

          {/* NumPad */}
          <div className="mb-5">
            <NumPad value={amount} onChange={setAmount} />
          </div>

          {/* Account Selector */}
          <div className="mb-3">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Cuenta de origen
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar</option>
              {accounts?.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.display_name || acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category selector (mobile) */}
          <div className="mb-3">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Categoría
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar categoría</option>
              {categories?.filter((c) => c.is_active).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Nota <span className="text-muted-foreground/60">(Opcional)</span>
            </label>
            <div className="relative">
              <FileText
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="¿En qué gastaste?"
                className="w-full h-10 rounded-lg border border-border bg-accent/30 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || parseFloat(amount) <= 0}
            className="w-full bg-keda-green hover:bg-keda-green-dark text-white font-semibold h-12 text-sm uppercase tracking-wider gap-2"
          >
            <Plus size={18} />
            {mutation.isPending ? "Guardando..." : "Agregar Gasto"}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-destructive mt-3 text-center">
              Error: {(mutation.error as any).message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
