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
      const formattedInteger = new Intl.NumberFormat("en-US").format(parseInt(integerPart || "0", 10));
      if (val.includes(".")) {
        return `${formattedInteger}.${decimalPart || ""}`;
      }
      return formattedInteger;
    };

    return (
      <div className="w-full flex flex-col items-center">
        <Input
          type="text"
          value={formatDisplayValue(value)}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            if (rawValue === "" || /^(\d*\.?\d{0,2})$/.test(rawValue)) {
              onChange(rawValue);
            }
          }}
          className="text-5xl text-center h-24 font-black bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-slate-200"
          placeholder="0"
        />
      </div>
    );
  }

  return <NumPad value={value} onChange={onChange} />;
}
