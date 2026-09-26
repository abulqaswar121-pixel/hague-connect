import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { verificationTiers } from "@/data/content";
import { Badge } from "@/components/ui/badge";

const tierStyles: Record<string, { ring: string; chip: string; dot: string }> = {
  bronze: { ring: "hover:border-[#B0783C]/60", chip: "bg-[#B0783C]/15 text-[#c98d4b] border-[#B0783C]/40", dot: "bg-[#B0783C]" },
  silver: { ring: "hover:border-slate-400/70", chip: "bg-slate-400/15 text-slate-300 border-slate-400/40", dot: "bg-slate-400" },
  gold: { ring: "hover:border-gold-500/60", chip: "bg-gold-500/15 text-gold-400 border-gold-500/40", dot: "bg-gold-500" },
  platinum: { ring: "hover:border-white/50", chip: "bg-white/10 text-white border-white/30", dot: "bg-white" },
};

export function VerificationPillars() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {verificationTiers.map((t, i) => {
        const st = tierStyles[t.id];
        return (
          <div
            key={t.id}
            className={`group relative flex flex-col rounded-2xl border border-white/10 bg-white/[.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[.07] ${st.ring}`}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${st.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                {t.name}
              </span>
              <span className="font-display text-xs font-bold text-white/25">TIER {i + 1}</span>
            </div>
            <p className="mt-4 text-sm font-bold text-white">{t.tagline}</p>
            <ul className="mt-3 flex-1 space-y-2">
              {t.requirements.slice(0, 3).map((r) => (
                <li key={r} className="flex items-start gap-2 text-xs leading-relaxed text-white/55">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <Link
        to="/verification"
        className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-6 text-sm font-bold text-white/60 transition-colors hover:border-vermilion-500/50 hover:text-white sm:col-span-2 xl:col-span-4"
      >
        Explore the full verification framework
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
