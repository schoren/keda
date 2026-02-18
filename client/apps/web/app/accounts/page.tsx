"use client";

import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { AccountList } from "../../components/AccountList";
import { Modal } from "../../components/Modal";
import { AccountForm } from "../../components/AccountForm";
import styles from "../page.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Plus } from "lucide-react";

export default function AccountsPage() {
  const { householdId, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className={styles.content}>
        <div className={styles.headerTitle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Cuentas</h1>
              <p>Gestiona tus cuentas bancarias y efectivo</p>
            </div>
            <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              <span>Nueva Cuenta</span>
            </button>
          </div>
        </div>

        <div className={styles.singleColumn}>
          <AccountList />
        </div>

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
