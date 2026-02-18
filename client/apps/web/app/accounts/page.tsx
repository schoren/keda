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
      <div className="px-5 md:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Cuentas</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus cuentas bancarias y efectivo</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-keda-green hover:bg-keda-green-dark text-white gap-2"
          >
            <Plus size={18} />
            Nueva Cuenta
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
