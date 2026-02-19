"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: {
    id: string;
    name: string;
    budget: number;
    spent: number;
    icon?: string;
  }[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
      
      {/* Add Category placeholder */}
      <Link
        href="/budget-management"
        className="group flex items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-6 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all min-h-[100px]"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
        </div>
        <span className="text-sm font-black text-slate-400 group-hover:text-emerald-500 uppercase tracking-widest">
          Nueva Categoría
        </span>
      </Link>
    </div>
  );
}
