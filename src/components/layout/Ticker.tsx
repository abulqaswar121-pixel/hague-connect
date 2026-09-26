import { Radio } from "lucide-react";
import { tickerItems } from "@/data/commodities";
import { usePrefs } from "@/store/prefs";
import { fmtMoney, fmtPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTicker() {
  const currency = usePrefs((s) => s.currency);

  return (
    <div className="pause-on-hover relative flex items-stretch overflow-hidden border-b border-white/10 bg-[#071120] text-white">
      <div className="relative z-10 flex items-center gap-1.5 border-r border-white/10 bg-vermilion-600 px-3 py-1.5">
        <Radio className="h-3 w-3 animate-pulse" />
        <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.14em] sm:block">
          Live FOB
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-marquee flex w-max items-center whitespace-nowrap py-1.5">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {tickerItems.map((t, i) => (
                <div key={`${copy}-${i}`} className="flex items-center text-[11.5px]">
                  <span className="font-semibold text-white/85">{t.name}</span>
                  <span className="ml-2 font-mono font-bold tabular-nums text-white">
                    {fmtMoney(t.fobUsd, currency)}
                    <span className="font-sans text-white/40">/MT</span>
                  </span>
                  <span
                    className={cn(
                      "ml-1.5 font-mono font-bold tabular-nums",
                      t.change >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {fmtPct(t.change)}
                  </span>
                  <span className="mx-4 h-1 w-1 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 hidden items-center border-l border-white/10 px-3 md:flex">
        <span className="text-[10px] font-semibold text-brandblue-300">
          Indicative · Lagos Apapa · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </span>
      </div>
    </div>
  );
}
