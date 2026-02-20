"use client";

import { NumPad } from "./NumPad";
import { Input } from "./ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
}

export function NumericKeypad({ value, onChange }: NumericKeypadProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isMobile) {
    const formatDisplayValue = (val: string) => {
      if (val === "" || val === "0") return "";
      const [integerPart, decimalPart] = val.split(".");
      const formattedInteger = new Intl.NumberFormat("en-US").format(
        parseInt(integerPart || "0", 10)
      );
      if (val.includes(".")) {
        return `${formattedInteger}.${decimalPart || ""}`;
      }
      return formattedInteger;
    };

    return (
      <div className="w-full">
        <div className="bg-white rounded-[32px] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 focus-within:border-emerald-400 focus-within:ring-8 focus-within:ring-emerald-50 transition-all flex flex-col items-center justify-center min-h-[240px]">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            Ingresa el monto
          </div>
          <div className="relative w-full flex items-center justify-center">
            <span className="absolute left-0 md:static text-4xl font-black text-emerald-300 mr-2">$</span>
            <Input
              type="text"
              value={formatDisplayValue(value)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (rawValue === "" || /^(\d*\.?\d{0,2})$/.test(rawValue)) {
                  onChange(rawValue);
                }
              }}
              className="text-7xl md:text-8xl text-center h-auto py-2 font-black bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-slate-100 text-emerald-600 w-full"
              placeholder="0"
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  return <NumPad value={value} onChange={onChange} />;
}
