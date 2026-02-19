"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
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
  Plus,
} from "lucide-react";

const categoryIcons: Record<string, { icon: React.ComponentType<any>; color: string; bg: string }> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  comida: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-100" },
  alimentación: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-100" },
  transporte: { icon: Car, color: "text-blue-600", bg: "bg-blue-100" },
  ocio: { icon: Gamepad2, color: "text-purple-600", bg: "bg-purple-100" },
  compras: { icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-100" },
  vivienda: { icon: Home, color: "text-rose-600", bg: "bg-rose-100" },
  salud: { icon: Heart, color: "text-green-600", bg: "bg-green-100" },
  trabajo: { icon: Briefcase, color: "text-slate-600", bg: "bg-slate-100" },
  educación: { icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100" },
  regalos: { icon: Gift, color: "text-pink-600", bg: "bg-pink-100" },
  mascotas: { icon: PawPrint, color: "text-amber-600", bg: "bg-amber-100" },
  servicios: { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
  entretenimiento: { icon: Tv, color: "text-violet-600", bg: "bg-violet-100" },
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase();
  return categoryIcons[key] ?? { icon: ShoppingBag, color: "text-slate-600", bg: "bg-slate-100" };
}

interface CategoryCardProps {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
}

export function CategoryCard({
  id,
  name,
  budget,
  spent,
  remaining,
}: CategoryCardProps) {
  const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const isOverBudget = percent > 90;
  const { icon: Icon, color, bg } = getCategoryIcon(name);

  return (
    <Link
      href={`/expenses/new?categoryId=${id}`}
      className="group block bg-white rounded-lg border border-border p-4 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bg)}>
            <Icon size={16} className={color} />
          </div>
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">
          ${budget.toLocaleString()}
        </span>
      </div>

      {/* Progress */}
      <Progress
        value={percent}
        className="h-1.5 mb-2"
      // We use inline style for the indicator color since Progress component uses CSS vars
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium",
          isOverBudget ? "text-destructive" : "text-keda-green"
        )}>
          ${remaining >= 0 ? remaining.toLocaleString() : "0"} restante
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(percent)}% usado
        </span>
      </div>
    </Link>
  );
}

interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    budget: number;
    spent: number;
    remaining: number;
  }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div>
      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} {...cat} />
        ))}
        {/* Add Category card */}
        <Link
          href="/budgets"
          className="flex flex-col items-center justify-center bg-white rounded-lg border border-dashed border-border p-4 hover:border-keda-green hover:bg-keda-green/5 transition-all min-h-[120px]"
        >
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-2">
            <Plus size={20} className="text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Agregar Categoría
          </span>
        </Link>
      </div>

      {/* Mobile: List */}
      <div className="md:hidden space-y-3">
        {categories.map((cat) => (
          <MobileCategoryItem key={cat.id} {...cat} />
        ))}
      </div>
    </div>
  );
}

function MobileCategoryItem({
  id,
  name,
  budget,
  spent,
  remaining,
}: CategoryCardProps) {
  const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const isOverBudget = percent > 90;
  const { icon: Icon, color, bg } = getCategoryIcon(name);

  return (
    <Link
      href={`/expenses/new?categoryId=${id}`}
      className="flex items-center gap-3 bg-white rounded-lg border border-border p-4"
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", bg)}>
        <Icon size={18} className={color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase">Resta</p>
            <p className={cn(
              "text-sm font-semibold",
              isOverBudget ? "text-destructive" : "text-foreground"
            )}>
              ${remaining >= 0 ? remaining.toLocaleString() : "0.00"}
            </p>
          </div>
        </div>
        <Progress
          value={percent}
          className="h-1.5"
        />
      </div>
    </Link>
  );
}
