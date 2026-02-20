"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface DynamicAmountDisplayProps {
  value: string;
}

export function DynamicAmountDisplay({ value }: DynamicAmountDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(48);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth === 0) return;

    let currentFontSize = 48;
    textRef.current.style.fontSize = `${currentFontSize}px`;
    
    // Simple iterative scaling to fit
    while (textRef.current.offsetWidth > containerWidth && currentFontSize > 16) {
      currentFontSize -= 1;
      textRef.current.style.fontSize = `${currentFontSize}px`;
    }
    
    setFontSize(currentFontSize);
  }, [value]);

  const formatDisplayValue = (val: string) => {
    if (val === "" || val === "0") return "0";
    
    const [integerPart, decimalPart] = val.split(".");
    const formattedInteger = new Intl.NumberFormat("en-US").format(parseInt(integerPart || "0", 10));
    
    if (val.includes(".")) {
      return `${formattedInteger}.${decimalPart || ""}`;
    }
    
    return formattedInteger;
  };

  const displayValue = formatDisplayValue(value);

  return (
    <div ref={containerRef} className="w-full text-center overflow-hidden h-20 flex items-center justify-center bg-background">
      <span 
        ref={textRef} 
        className="font-bold whitespace-nowrap transition-[font-size] duration-75"
        style={{ fontSize: `${fontSize}px` }}
      >
        {displayValue}
      </span>
    </div>
  );
}
