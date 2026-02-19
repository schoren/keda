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
import { useTranslation } from "@repo/i18n";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: t('nav.overview'), href: "/", icon: LayoutDashboard },
    { name: t('nav.expenses'), href: "/transactions", icon: Receipt },
    { name: t('nav.budgets'), href: "/budget-management", icon: PiggyBank },
    { name: t('nav.accounts'), href: "/accounts", icon: Wallet },
  ];

  return (
    <aside className="flex flex-col w-60 h-full bg-white border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-keda-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Keda</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="md:hidden text-slate-400"
        >
          <X className="w-5 h-5" />
        </Button>
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

        {/* Language Switcher */}
        <div className="flex items-center gap-1 mb-4 p-1 bg-slate-50 rounded-lg">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={cn(
              "flex-1 px-2 py-1.5 text-[10px] font-black rounded-md transition-all uppercase tracking-widest",
              i18n.language.startsWith('en')
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('es')}
            className={cn(
              "flex-1 px-2 py-1.5 text-[10px] font-black rounded-md transition-all uppercase tracking-widest",
              i18n.language.startsWith('es')
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            ES
          </button>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-1"
        >
          <LogOut size={16} />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
