"use client";

import { NumPad } from "./NumPad";
import { Input } from "./ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState, useLayoutEffect, useRef } from "react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
}

export function NumericKeypad({ value, onChange }: NumericKeypadProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(48);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const displayValue = formatDisplayValue(value);

  useLayoutEffect(() => {
    if (isMobile || !containerRef.current) return;

    // Standard container width or mock fallback
    const containerWidth = (containerRef.current.clientWidth || 500) - 100;
    const textLength = (displayValue || "0").length;
    
    // More conservative character width factor for font-black
    const charWidthFactor = 0.8;
    
    // Calculate required font size
    let calculatedSize = Math.floor(containerWidth / (textLength * charWidthFactor));
    
    // Clamp between 20px and 48px
    calculatedSize = Math.min(48, Math.max(20, calculatedSize));

    setFontSize(calculatedSize);
  }, [value, isMobile, displayValue]);

  if (!mounted) return null;

  if (!isMobile) {
    return (
      <div className="w-full">
        <div 
          ref={containerRef}
          className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 focus-within:border-emerald-400 focus-within:ring-8 focus-within:ring-emerald-50 transition-all flex flex-col items-center justify-center min-h-[200px] md:min-h-[240px]"
        >
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            Ingresa el monto
          </div>
          <div className="relative w-full flex items-center justify-center">
            <span 
              className="text-emerald-300 font-black mr-2 shrink-0 transition-all"
              style={{ fontSize: `${Math.max(20, fontSize * 0.5)}px` }}
            >$</span>
            
            <Input
              type="text"
              data-testid="desktop-amount-input"
              value={displayValue}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (rawValue === "" || /^(\d*\.?\d{0,2})$/.test(rawValue)) {
                  onChange(rawValue);
                }
              }}
              className="text-center h-auto py-2 font-black bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-slate-100 text-emerald-600 w-full transition-all"
              style={{ fontSize: `${fontSize}px` }}
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
