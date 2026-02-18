"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { Landmark, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountList() {
  const api = useApi();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.getAccounts(),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Cargando cuentas...</div>;
  if (error) return <div className="text-sm text-destructive p-4">Error al cargar cuentas</div>;

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Mis Cuentas</h3>
      </div>

      <div className="divide-y divide-border">
        {accounts?.map((account) => (
          <div key={account.id} className="flex items-center gap-3 px-5 py-3">
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              account.type === "credit" ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"
            )}>
              {account.type === "credit" ? <CreditCard size={18} /> : <Landmark size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={cn(
                "text-[10px] uppercase font-semibold tracking-wider",
                account.type === "credit" ? "text-violet-600" : "text-blue-600"
              )}>
                {account.type === "credit" ? "Crédito" : "Débito"}
              </span>
              <p className="text-sm font-medium text-foreground">{account.name}</p>
            </div>
          </div>
        ))}

        {accounts?.length === 0 && (
          <p className="text-center py-8 text-sm text-muted-foreground">
            No tienes cuentas registradas.
          </p>
        )}
      </div>
    </div>
  );
}
