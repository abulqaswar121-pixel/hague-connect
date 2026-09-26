import { SearchCheck, FileSignature, MessagesSquare, Ship } from "lucide-react";
import { howItWorksSteps } from "@/data/content";

const icons = [SearchCheck, FileSignature, MessagesSquare, Ship];

export function HowItWorksFlow({ dark = false }: { dark?: boolean }) {
  return (
    <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* connector */}
      <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-brandblue-500/60 to-transparent xl:block" />
      {howItWorksSteps.map((s, i) => {
        const Icon = icons[i];
        return (
          <div key={s.step} className="relative">
            <div
              className={
                "group relative h-full rounded-2xl border p-6 transition-all duration-300 " +
                (dark
                  ? "border-white/10 bg-white/[.04] hover:border-vermilion-500/40 hover:bg-white/[.07]"
                  : "border-slate-200 bg-white shadow-card hover:-translate-y-1 hover:shadow-lift")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vermilion-600 text-white shadow-lg shadow-vermilion-600/25 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={
                    "font-display text-4xl font-extrabold tracking-tight " +
                    (dark ? "text-white/10" : "text-slate-100")
                  }
                >
                  {s.step}
                </span>
              </div>
              <h3 className={"mt-5 font-display text-base font-bold " + (dark ? "text-white" : "text-navy-950")}>
                {s.title}
              </h3>
              <p className={"mt-2 text-[13px] leading-relaxed " + (dark ? "text-white/55" : "text-slate-500")}>
                {s.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
