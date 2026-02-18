"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Wallet,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { name: "Resumen", href: "/", icon: LayoutDashboard },
  { name: "Gastos", href: "/transactions", icon: Receipt },
  { name: "Presupuestos", href: "/budgets", icon: PiggyBank },
  { name: "Cuentas", href: "/accounts", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 bg-white border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-keda-green flex items-center justify-center">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <span className="font-semibold text-lg text-foreground">Keda</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-keda-green/10 text-keda-green"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          {user?.picture_url && (
            <Image
              src={user.picture_url}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-1"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
