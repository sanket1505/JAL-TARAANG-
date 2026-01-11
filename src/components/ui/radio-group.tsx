"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "./utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // 1. BASE STYLES (Unchecked)
        "aspect-square size-4 shrink-0 rounded-full border border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        
        // 2. CHECKED STATE: 
        // We use !border-[#f97316] to FORCE the border to Orange, ignoring Dark Mode white colors.
        "data-[state=checked]:!border-[#f97316]",
        
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        {/* 3. NATIVE SVG DOT:
            We apply fill="#f97316" DIRECTLY to the circle. 
            This ensures the dot is ALWAYS Orange, even if your theme tries to make it white.
        */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-2.5"
        >
          <circle cx="5" cy="5" r="3.5" fill="#f97316" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };