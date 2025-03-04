"use client";

import { cn } from "@/lib/utils";
import { Input as BaseInput } from "@/components/ui/input";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, fullWidth = false, ...props }, ref) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <BaseInput
          className={cn(
            "h-11 rounded-full border-2 border-[#949F6E] bg-[#FAFAD2] px-4 py-2 text-[#5C6246] ring-offset-background placeholder:text-[#949F6E]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#949F6E]/30 focus-visible:ring-offset-2 focus-visible:border-[#99aa59] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-colors",

            fullWidth && "w-full",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
