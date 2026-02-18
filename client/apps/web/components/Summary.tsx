"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "../app/providers";
import styles from "./Summary.module.css";

interface SummaryProps {
  month: string;
  householdId: string;
}

export function Summary({ month, householdId }: SummaryProps) {
  const api = useApi();

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ["summary", householdId, month],
    queryFn: () => api.getSummary(month),
    enabled: !!householdId,
  });

  if (isLoading) return <div className={styles.skeleton}>Cargando resumen...</div>;
  if (error) return <div className={styles.error}>Error al cargar el resumen</div>;
  if (!summary) return null;

  const percent = summary.total_budget > 0
    ? Math.min(100, (summary.total_spent / summary.total_budget) * 100)
    : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Resumen Mensual</h3>
        <span className={styles.monthName}>{month}</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <label>Gastado</label>
          <span className={styles.amount}>${summary.total_spent.toLocaleString()}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <label>Presupuesto</label>
          <span className={styles.budget}>${summary.total_budget.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${percent}%`, backgroundColor: percent > 90 ? '#ef4444' : '#10b981' }}
        />
      </div>

      <p className={styles.remaining}>
        {summary.total_budget - summary.total_spent >= 0
          ? `Te quedan $${(summary.total_budget - summary.total_spent).toLocaleString()} este mes`
          : `Te has pasado por $${(summary.total_spent - summary.total_budget).toLocaleString()}`}
      </p>
    </div>
  );
}
