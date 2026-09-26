import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { usePrefs } from "@/store/prefs";
import { fmtMoney, fmtPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  usd,
  suffix = "/MT",
  className,
  amountClassName,
  compact = false,
}: {
  usd: number;
  suffix?: string;
  className?: string;
  amountClassName?: string;
  compact?: boolean;
}) {
  const currency = usePrefs((s) => s.currency);
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className={cn("font-display font-bold text-navy-950 tabular-nums", amountClassName)}>
        {fmtMoney(usd, currency, { compact })}
      </span>
      {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
    </span>
  );
}

export function PriceChange({ pct, className }: { pct: number; className?: string }) {
  const Icon = pct > 0.05 ? TrendingUp : pct < -0.05 ? TrendingDown : Minus;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums",
        pct > 0.05 && "text-emerald-600",
        pct < -0.05 && "text-red-500",
        Math.abs(pct) <= 0.05 && "text-slate-400",
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {fmtPct(pct)}
    </span>
  );
}
