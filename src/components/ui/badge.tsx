import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy-950 text-white",
        accent: "border-transparent bg-vermilion-600 text-white",
        "accent-soft": "border-vermilion-500/30 bg-vermilion-50 text-vermilion-700",
        gold: "border-transparent bg-gold-500 text-navy-950",
        "gold-soft": "border-gold-500/40 bg-gold-50 text-gold-700",
        navy: "border-navy-800/20 bg-navy-50 text-navy-800",
        outline: "border-slate-300 bg-white text-slate-600",
        success: "border-transparent bg-emerald-600 text-white",
        "success-soft": "border-emerald-500/30 bg-emerald-50 text-emerald-700",
        warning: "border-amber-500/30 bg-amber-50 text-amber-700",
        info: "border-brandblue-500/30 bg-brandblue-50 text-brandblue-700",
        muted: "border-slate-200 bg-slate-100 text-slate-500",
        danger: "border-red-500/30 bg-red-50 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
