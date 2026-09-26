import { Check, Medal, ScanSearch, ShieldCheck, Globe2 } from "lucide-react";
import type { VerificationTier } from "@/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/misc";

const config: Record<
  VerificationTier,
  { label: string; short: string; icon: React.ElementType; classes: string }
> = {
  bronze: {
    label: "Bronze — Basic Verification",
    short: "Bronze",
    icon: Medal,
    classes: "border-[#B0783C]/40 bg-[#B0783C]/10 text-[#8a5a24]",
  },
  silver: {
    label: "Silver — CAC / NEPC Document Verified",
    short: "Silver",
    icon: Check,
    classes: "border-slate-400/50 bg-slate-100 text-slate-600",
  },
  gold: {
    label: "Gold — Site Inspection Verified",
    short: "Gold",
    icon: ShieldCheck,
    classes: "border-gold-500/50 bg-gold-50 text-gold-700",
  },
  platinum: {
    label: "Platinum — International Trade Certified",
    short: "Platinum",
    icon: Globe2,
    classes: "border-navy-800/30 bg-navy-950 text-white",
  },
};

export function VerificationBadge({
  tier,
  size = "md",
  withTooltip = true,
  className,
}: {
  tier: VerificationTier;
  size?: "sm" | "md" | "lg";
  withTooltip?: boolean;
  className?: string;
}) {
  const c = config[tier];
  const Icon = c.icon;
  const chip = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-bold whitespace-nowrap",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-[11px]",
        size === "lg" && "px-3.5 py-1.5 text-xs",
        c.classes,
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} strokeWidth={2.75} />
      {c.short} Verified
    </span>
  );

  if (!withTooltip) return chip;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{chip}</TooltipTrigger>
        <TooltipContent>{c.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function InspectionChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700",
        className
      )}
    >
      <ScanSearch className="h-3.5 w-3.5" /> Inspection Ready
    </span>
  );
}

export function NepcChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-brandblue-500/30 bg-brandblue-50 px-2.5 py-1 text-[11px] font-bold text-brandblue-700",
        className
      )}
    >
      <ShieldCheck className="h-3.5 w-3.5" /> NEPC Registered
    </span>
  );
}
