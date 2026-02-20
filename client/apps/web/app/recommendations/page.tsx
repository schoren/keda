"use client";

import { useApi } from "../providers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recommendation } from "@repo/shared";
import { Lightbulb, Check, ArrowLeft } from "lucide-react";
import { formatMoney } from "@repo/shared";
import { useTranslation } from "@repo/i18n";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecommendationsPage() {
  const { t } = useTranslation();
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading } = useQuery({
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

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
        <header className="px-6 pt-10 pb-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 leading-none">
              {t('recommendations.title')}
            </h1>
          </div>
        </header>

        <main className="flex-1 px-6 pb-24 max-w-2xl mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : !recommendations || recommendations.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <Check size={32} />
              </div>
              <p className="text-slate-400 font-bold">Todo en orden. No hay recomendaciones por ahora.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Lightbulb size={24} />
                  <p className="text-sm font-bold uppercase tracking-widest">Sugerencias Inteligentes</p>
                </div>
                
                <p className="text-sm text-slate-500 leading-relaxed">
                  Basado en tus gastos del mes pasado, sugerimos ajustar estos presupuestos para que se alineen mejor con tu realidad.
                </p>

                <div className="space-y-3 pt-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{rec.category}</p>
                        <p className="text-lg font-black text-slate-900 font-mono">{formatMoney(rec.amount)}</p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">
                        Ajuste Sugerido
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => apply(recommendations)}
                disabled={isPending}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-md transition-all text-lg"
              >
                {isPending ? t('recommendations.applying') : t('recommendations.apply_all')}
              </Button>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
