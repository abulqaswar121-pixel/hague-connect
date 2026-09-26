import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion-500/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.985] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-navy-950 text-white shadow hover:bg-navy-900",
        accent:
          "bg-vermilion-600 text-white shadow hover:bg-vermilion-500 shadow-vermilion-600/20",
        gold: "bg-gold-500 text-navy-950 shadow hover:bg-gold-400",
        outline:
          "border border-slate-300 bg-white text-navy-900 shadow-sm hover:bg-slate-50 hover:border-slate-400",
        "outline-light":
          "border border-white/25 bg-white/5 text-white hover:bg-white/15 hover:border-white/40",
        secondary: "bg-slate-100 text-navy-900 hover:bg-slate-200",
        ghost: "text-navy-900 hover:bg-slate-100",
        "ghost-light": "text-white/80 hover:bg-white/10 hover:text-white",
        destructive: "bg-red-600 text-white shadow hover:bg-red-500",
        link: "text-vermilion-600 underline-offset-4 hover:underline",
        whatsapp: "bg-[#25D366] text-white shadow hover:bg-[#1eb856]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-[15px]",
        xl: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
