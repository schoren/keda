"use client";

import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";

interface NumPadProps {
  value: string;
  onChange: (value: string) => void;
}

export function NumPad({ value, onChange }: NumPadProps) {
  const handlePress = (key: string) => {
    if (key === "backspace") {
      onChange(value.length <= 1 ? "" : value.slice(0, -1));
      return;
    }

    if (key === "." && value.includes(".")) return;
    if (key === "." && (value === "0" || value === "")) {
      onChange("0.");
      return;
    }

    if (key === "00" || key === "000") {
      if (value === "" || value === "0") return;
      if (value.includes(".")) {
        const parts = value.split(".");
        if (parts[1].length >= 2) return;
        if (parts[1].length === 1 && key === "000") {
          onChange(value + "0"); // Only one zero fits
          return;
        }
      }
      onChange(value + key);
      return;
    }

    // Limit to 2 decimal places
    const parts = value.split(".");
    if (parts[1] && parts[1].length >= 2) return;

    if (value === "0" && key !== ".") {
      onChange(key);
    } else {
      onChange(value + key);
    }
  };

  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "00", "0", "000",
    ".", "backspace",
  ];

  return (
    <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => handlePress(key)}
          aria-label={key === "backspace" ? "backspace" : key}
          className={cn(
            "h-14 rounded-xl text-lg font-medium transition-colors",
            "bg-accent/50 hover:bg-accent active:bg-accent/80",
            "flex items-center justify-center",
            key === "backspace" && "text-muted-foreground",
            key === "." && "col-start-1"
          )}
        >
          {key === "backspace" ? <Delete size={22} /> : key}
        </button>
      ))}
    </div>
  );
}
