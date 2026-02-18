"use client";

import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { TransactionList } from "../../components/TransactionList";
import { Modal } from "../../components/Modal";
import { TransactionForm } from "../../components/TransactionForm";
import styles from "../page.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className={styles.content}>
        <div className={styles.headerTitle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Transacciones</h1>
              <p>Historial de ingresos y gastos</p>
            </div>
            <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              <span>Nuevo Gasto</span>
            </button>
          </div>
        </div>

        <div className={styles.singleColumn}>
          <TransactionList month={currentMonth} />
        </div>

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
