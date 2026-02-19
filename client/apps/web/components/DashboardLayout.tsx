"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

export function DashboardLayout({ children, headerContent }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-keda-green/30 border-t-keda-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background font-sans flex overflow-hidden">
      {/* Sidebar Overlay - Mobile only */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Permanent on Desktop, Drawer on Mobile */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-xl md:shadow-none md:border-r md:border-slate-100 md:static md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Unified Top Bar */}
        <header className="flex items-center h-16 px-4 md:px-6 border-b border-slate-100 bg-white sticky top-0 z-30 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-500 mr-2 md:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 flex justify-center overflow-hidden">
            {headerContent}
          </div>

          {/* Placeholder for symmetry on mobile, maybe useful for desktop too */}
          <div className="w-10 md:hidden" /> 
        </header>

        <main className="flex-1 min-w-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
