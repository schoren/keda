"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { useRouter } from "next/navigation";

export default function NewExpensePage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to transactions list or dashboard
    router.push("/transactions");
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">New Expense</h1>
      <ExpenseForm onSuccess={handleSuccess} />
    </div>
  );
}
