"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Familia", href: "/family", icon: Users },
  { name: "Ajustes", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

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
