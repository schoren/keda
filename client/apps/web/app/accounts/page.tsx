"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AccountList } from "@/components/AccountList";
import { Modal } from "@/components/Modal";
import { AccountForm } from "@/components/AccountForm";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none mb-2">Cuentas</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Gestiona tus cuentas bancarias y efectivo</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl gap-2 h-11 px-5 shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva Cuenta</span>
          </Button>
        </div>

        <AccountList />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nueva Cuenta"
        >
          <AccountForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
