"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Users, Settings, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@repo/i18n";

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const tabs = [
    { name: t('nav.overview'), href: "/", icon: Home },
    { name: t('nav.accounts'), href: "/accounts", icon: Wallet },
    { name: t('nav.reports'), href: "/reports", icon: BarChart3 },
    { name: t('nav.family'), href: "/family", icon: Users },
    { name: t('nav.settings'), href: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-[64px]",
                isActive
                  ? "text-keda-green"
                  : "text-muted-foreground"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
