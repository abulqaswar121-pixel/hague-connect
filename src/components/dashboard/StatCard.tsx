import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "navy",
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "navy" | "accent" | "gold" | "emerald" | "blue";
}) {
  const tones = {
    navy: "bg-navy-950 text-white",
    accent: "bg-vermilion-600 text-white",
    gold: "bg-gold-500 text-navy-950",
    emerald: "bg-emerald-600 text-white",
    blue: "bg-brandblue-600 text-white",
  };
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold text-navy-950">{value}</span>
          {sub && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Trend({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <ArrowUpRight className="h-3 w-3" /> {children}
    </span>
  );
}
