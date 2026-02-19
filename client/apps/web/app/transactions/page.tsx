"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionList } from "@/components/TransactionList";
import { Modal } from "@/components/Modal";
import { TransactionForm } from "@/components/TransactionForm";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none mb-2">Transacciones</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Historial de ingresos y gastos</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl gap-2 h-11 px-5 shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nuevo Gasto</span>
          </Button>
        </div>

        <TransactionList month={currentMonth} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nueva Transacción"
        >
          <TransactionForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
