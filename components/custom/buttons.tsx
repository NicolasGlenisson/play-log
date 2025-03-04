"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

// Définition des variantes avec class-variance-authority
const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200  disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#949F6E] text-[#f8f9f0] hover:bg-[#8a9462] shadow-md shadow-[#949F6E]/30 hover:shadow-lg hover:shadow-[#949F6E]/25 active:scale-[0.98]",
        secondary:
          "bg-[#E9EDCA] text-[#5c6246] hover:bg-[#dfe4b5] shadow-md shadow-[#E9EDCA]/50 hover:shadow-lg hover:shadow-[#E9EDCA]/40 active:scale-[0.98]",
        destructive:
          "bg-[#F2C4C4] text-[#a94848] hover:bg-[#EDAfAF] shadow-md shadow-[#F2C4C4]/50 hover:shadow-lg hover:shadow-[#F2C4C4]/40 active:scale-[0.98]",
      },
      size: {
        default: "text-base h-11",
        sm: "text-sm h-9 px-4",
        lg: "text-lg h-14 px-8",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Extension pour inclure la propriété isPressed
export interface ToggleProps extends ButtonProps {
  isPressed?: boolean;
  onPressedChange?: (isPressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      isPressed = false,
      onPressedChange,
      onClick,
      ...props
    },
    ref
  ) => {
    // Gérer le clic pour mettre à jour isPressed
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onPressedChange) {
          onPressedChange(!isPressed);
        }
        onClick?.(e);
      },
      [onClick, onPressedChange, isPressed]
    );

    return (
      <Button
        ref={ref}
        className={cn(
          isPressed ? "border-4 shadow-inner" : "border-0 shadow-none",
          isPressed &&
            variant === "primary" &&
            "bg-[#6d753c] border-[#4e5a2b] text-[#e0e4d1]",
          isPressed &&
            variant === "secondary" &&
            "bg-[#c7cca3] border-[#a1a78b] text-[#3e422a]",
          isPressed &&
            variant === "destructive" &&
            "bg-[#d28a8a] border-[#b06a6a] text-[#7a2c2c]",
          className
        )}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        disabled={disabled}
        aria-pressed={isPressed}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Button, Toggle, buttonVariants };
