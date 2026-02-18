"use client";

import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthlySummary } from "@repo/shared";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  summary: MonthlySummary | null;
}

export function TopBar({ summary }: TopBarProps) {
  const { user } = useAuth();
  const remaining = summary
    ? summary.total_budget - summary.total_spent
    : 0;

  return (
    <header className="hidden md:flex items-center justify-between px-8 h-16 bg-white border-b border-border">
      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Presupuesto Total
          </p>
          <p className="text-lg font-bold text-foreground">
            ${summary?.total_budget.toLocaleString() ?? "0"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Gastado
          </p>
          <p className="text-lg font-bold text-foreground">
            ${summary?.total_spent.toLocaleString() ?? "0"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Disponible
          </p>
          <p className={`text-lg font-bold ${remaining >= 0 ? "text-keda-green" : "text-destructive"}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/expenses/new">
          <Button className="bg-keda-green hover:bg-keda-green-dark text-white font-semibold gap-2">
            <Plus size={18} />
            Nuevo Gasto
          </Button>
        </Link>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell size={20} className="text-muted-foreground" />
        </button>
        {user?.picture_url && (
          <Image
            src={user.picture_url}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
      </div>
    </header>
  );
}
