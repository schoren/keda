"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../app/providers";
import styles from "./TransactionForm.module.css";

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const api = useApi();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    mutation.mutate({
      amount: type === "expense" ? -Math.abs(numAmount) : Math.abs(numAmount),
      note,
      date: new Date(date as string).toISOString(),
      category_id: categoryId,
      account_id: accountId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.typeSelector}>
        <button
          type="button"
          className={`${styles.typeBtn} ${type === "expense" ? styles.activeExpense : ""}`}
          onClick={() => setType("expense")}
        >
          Gasto
        </button>
        <button
          type="button"
          className={`${styles.typeBtn} ${type === "income" ? styles.activeIncome : ""}`}
          onClick={() => setType("income")}
        >
          Ingreso
        </button>
      </div>

      <div className={styles.field}>
        <label>Monto</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label>Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label>Cuenta</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          <option value="">Seleccionar cuenta</option>
          {accounts?.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Categoría</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Seleccionar categoría</option>
          {categories?.filter(c => c.is_active).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Nota</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿En qué gastaste?"
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancelar
        </button>
        <button type="submit" disabled={mutation.isPending} className={styles.submitBtn}>
          {mutation.isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {mutation.isError && (
        <p className={styles.error}>Error: {(mutation.error as any).message}</p>
      )}
    </form>
  );
}
