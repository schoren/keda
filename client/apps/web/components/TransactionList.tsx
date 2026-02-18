"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/app/providers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUpRight, ArrowDownLeft, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionList({ month }: { month?: string }) {
  const api = useApi();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["transactions", month],
    queryFn: () => api.getTransactions(month),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Cargando transacciones...</div>;
  if (error) return <div className="text-sm text-destructive p-4">Error al cargar transacciones</div>;

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Transacciones Recientes</h3>
        <button className="text-xs text-keda-green hover:underline font-medium">Filtrar</button>
      </div>

      <div className="divide-y divide-border">
        {transactions?.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-5 py-3">
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              t.amount < 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            )}>
              {t.amount < 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {t.note || "Sin descripción"}
                </span>
                <span className={cn(
                  "text-sm font-semibold ml-2 shrink-0",
                  t.amount < 0 ? "text-foreground" : "text-keda-green"
                )}>
                  {t.amount < 0 ? "" : "+"}${Math.abs(t.amount).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(t.date), "PPP", { locale: es })}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag size={10} />
                  <span>{t.category_id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {transactions?.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No hay transacciones este mes.
          </div>
        )}
      </div>
    </div>
  );
}
