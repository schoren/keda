"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Button } from "@/components/ui/button";

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
    mutation.mutate({ name, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Nombre de la cuenta
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Banco Galicia, Efectivo..."
          required
          autoFocus
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Tipo de cuenta
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          required
          className="w-full h-10 rounded-lg border border-border bg-accent/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="debit">Débit / Efectivo / Ahorros</option>
          <option value="credit">Tarjeta de Crédito</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-keda-green hover:bg-keda-green-dark text-white"
        >
          {mutation.isPending ? "Creando..." : "Crear Cuenta"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
        >
          Cancelar
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">Error: {(mutation.error as any).message}</p>
      )}
    </form>
  );
}
