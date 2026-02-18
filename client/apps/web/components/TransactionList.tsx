"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../app/providers";
import styles from "./TransactionList.module.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUpRight, ArrowDownLeft, Tag } from "lucide-react";

export function TransactionList({ month }: { month?: string }) {
  const api = useApi();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["transactions", month],
    queryFn: () => api.getTransactions(month),
  });

  if (isLoading) return <div className={styles.skeleton}>Cargando transacciones...</div>;
  if (error) return <div className={styles.error}>Error al cargar transacciones</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Transacciones Recientes</h3>
        <button className={styles.filterBtn}>Filtrar</button>
      </div>

      <div className={styles.list}>
        {transactions?.map((t) => (
          <div key={t.id} className={styles.item}>
            <div className={`${styles.icon} ${t.amount < 0 ? styles.expense : styles.income}`}>
              {t.amount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
            </div>

            <div className={styles.info}>
              <div className={styles.mainInfo}>
                <span className={styles.note}>{t.note || "Sin descripción"}</span>
                <span className={`${styles.amount} ${t.amount < 0 ? styles.expenseText : styles.incomeText}`}>
                  {t.amount < 0 ? "" : "+"}{t.amount.toLocaleString()}
                </span>
              </div>

              <div className={styles.subInfo}>
                <span className={styles.date}>
                  {format(new Date(t.date), "PPP", { locale: es })}
                </span>
                <div className={styles.category}>
                  <Tag size={12} />
                  <span>{t.category_id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {transactions?.length === 0 && (
          <div className={styles.empty}>
            <p>No hay transacciones este mes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
