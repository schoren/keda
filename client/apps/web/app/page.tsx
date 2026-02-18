"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Summary } from "../components/Summary";
import { AccountList } from "../components/AccountList";
import { TransactionList } from "../components/TransactionList";
import { DashboardLayout } from "../components/DashboardLayout";
import { Modal } from "../components/Modal";
import { TransactionForm } from "../components/TransactionForm";
import styles from "./page.module.css";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function Home() {
  const { user, householdId, login, isAuthenticated, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (isAuthenticated && householdId) {
    return (
      <DashboardLayout>
        <div className={styles.content}>
          <div className={styles.headerTitle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Dashboard</h1>
                <p>Resumen de tu economía familiar</p>
              </div>
              <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                <Plus size={20} />
                <span>Nueva Transacción</span>
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.mainCol}>
              <Summary month={currentMonth} householdId={householdId} />
              <div style={{ marginTop: '1.5rem' }}>
                <TransactionList month={currentMonth} />
              </div>
            </div>

            <div className={styles.sideCol}>
              <AccountList />
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Registrar Transacción"
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

  return (
    <div className={styles.hero}>
      <div className={styles.glassCard}>
        <div className={styles.logoContainer}>
          <h1 className={styles.gradientText}>Keda</h1>
          <p className={styles.tagline}>Finanzas familiares simplificadas</p>
        </div>

        <div className={styles.authBox}>
          <p>Controla tus gastos con transparencia y facilidad.</p>
          <button onClick={() => login()} className={styles.googleBtn}>
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
