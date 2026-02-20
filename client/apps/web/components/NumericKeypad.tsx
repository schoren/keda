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
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(80);

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
    if (isMobile || !containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.offsetWidth - 100; // Account for padding and $
    if (containerWidth <= 0) return;

    let currentFontSize = 80;
    measureRef.current.style.fontSize = `${currentFontSize}px`;

    while (measureRef.current.offsetWidth > containerWidth && currentFontSize > 24) {
      currentFontSize -= 2;
      measureRef.current.style.fontSize = `${currentFontSize}px`;
    }

    setFontSize(currentFontSize);
  }, [value, isMobile]);

  if (!mounted) return null;

  if (!isMobile) {
    return (
      <div className="w-full">
        <div 
          ref={containerRef}
          className="bg-white rounded-[32px] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 focus-within:border-emerald-400 focus-within:ring-8 focus-within:ring-emerald-50 transition-all flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
            Ingresa el monto
          </div>
          <div className="relative w-full flex items-center justify-center">
            <span 
              className="text-emerald-300 font-black mr-2 shrink-0 transition-all"
              style={{ fontSize: `${Math.max(24, fontSize * 0.5)}px` }}
            >$</span>
            
            {/* Measuring span (hidden) */}
            <span 
              ref={measureRef} 
              className="absolute invisible whitespace-nowrap font-black"
              aria-hidden="true"
            >
              {displayValue || "0"}
            </span>

            <Input
              type="text"
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
