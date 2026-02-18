"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../app/providers";
import styles from "./TransactionForm.module.css"; // Reuse form styles

interface AccountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
  const api = useApi();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState<"debit" | "credit">("debit");

  const mutation = useMutation({
    mutationFn: (data: any) => api.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label>Nombre de la cuenta</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Banco Galicia, Efectivo..."
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label>Tipo de cuenta</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} required>
          <option value="debit">Débit / Efectivo / Ahorros</option>
          <option value="credit">Tarjeta de Crédito</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancelar
        </button>
        <button type="submit" disabled={mutation.isPending} className={styles.submitBtn}>
          {mutation.isPending ? "Creando..." : "Crear Cuenta"}
        </button>
      </div>

      {mutation.isError && (
        <p className={styles.error}>Error: {(mutation.error as any).message}</p>
      )}
    </form>
  );
}
