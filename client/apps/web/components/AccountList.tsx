"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../app/providers";
import styles from "./AccountList.module.css";
import { Landmark, CreditCard, Wallet as WalletIcon } from "lucide-react";

export function AccountList() {
  const api = useApi();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  if (isLoading) return <div className={styles.skeleton}>Cargando cuentas...</div>;
  if (error) return <div className={styles.error}>Error al cargar cuentas</div>;

  // const totalBalance = accounts?.reduce((sum, acc) => (acc as any).balance || 0, 0) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Mis Cuentas</h3>
        {/* <div className={styles.totalBadge}>
          Total: ${totalBalance.toLocaleString()}
        </div> */}
      </div>

      <div className={styles.list}>
        {accounts?.map((account) => (
          <div key={account.id} className={styles.accountCard}>
            <div className={styles.iconBox}>
              {account.type === "credit" ? <CreditCard size={20} /> : <Landmark size={20} />}
            </div>
            <div className={styles.details}>
              <span className={account.type === "credit" ? styles.creditLabel : styles.debitLabel}>
                {account.type === "credit" ? "Crédito" : "Débito"}
              </span>
              <span className={styles.accountName}>{account.name}</span>
            </div>
            {/* <div className={styles.balance}>
              ${(account as any).balance?.toLocaleString() || "0"}
            </div> */}
          </div>
        ))}

        {accounts?.length === 0 && (
          <p className={styles.empty}>No tienes cuentas registradas.</p>
        )}
      </div>
    </div>
  );
}
