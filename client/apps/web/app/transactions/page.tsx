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
      <div className="px-5 md:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Transacciones</h1>
            <p className="text-sm text-muted-foreground">Historial de ingresos y gastos</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-keda-green hover:bg-keda-green-dark text-white gap-2"
          >
            <Plus size={18} />
            Nuevo Gasto
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
