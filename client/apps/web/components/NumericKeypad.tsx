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
        <div className="bg-slate-50 rounded-[24px] p-8 border border-slate-100 focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
          <Input
            type="text"
            value={formatDisplayValue(value)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              if (rawValue === "" || /^(\d*\.?\d{0,2})$/.test(rawValue)) {
                onChange(rawValue);
              }
            }}
            className="text-6xl text-center h-20 font-black bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-slate-200 text-emerald-600"
            placeholder="0"
            autoFocus
          />
          <div className="text-center mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Ingresa el monto
          </div>
        </div>
      </div>
    );
  }

  return <NumPad value={value} onChange={onChange} />;
}
