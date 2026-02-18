"use client";

import { useApi } from "../app/providers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recommendation } from "@repo/shared";
import { Lightbulb, Check, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@repo/shared";

export function RecommendationsBanner() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.getRecommendations(),
  });

  const { mutate: apply, isPending } = useMutation({
    mutationFn: (recs: Recommendation[]) => api.applyRecommendations(recs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  if (isDismissed || !recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
              Recomendaciones de Presupuesto
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-emerald-800 dark:text-emerald-200/80 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{rec.action} ({formatMoney(rec.amount)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Descartar"
          className="text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-4 flex gap-3 pl-[52px]">
        <button
          onClick={() => apply(recommendations)}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {isPending ? (
            "Aplicando..."
          ) : (
            <>
              <Check size={16} />
              Aplicar todo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
