import { useNavigate } from "react-router-dom";
import { Check, Minus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { membershipPlans } from "@/data/content";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

export function PricingMatrix() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  function choose(plan: string) {
    if (plan === "Enterprise") {
      toast.success("Enterprise inquiry noted", {
        description: "Our trade desk will reach out within 4 business hours to scope your plan.",
      });
      return;
    }
    if (user) {
      toast.success(`${plan} plan selected`, {
        description: "Billing activates in Phase 2 — your account has been tagged for the upgrade.",
      });
    } else {
      navigate(`/register?plan=${encodeURIComponent(plan)}`);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {membershipPlans.map((p) => (
        <div
          key={p.name}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
            p.popular ? "border-vermilion-500 ring-1 ring-vermilion-500" : "border-slate-200"
          )}
        >
          {p.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="accent" className="gap-1 px-3 py-1 shadow">
                <Sparkles className="h-3 w-3" /> Most Popular
              </Badge>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-lg font-bold text-navy-950">{p.name}</h3>
            {user && user.tier === p.name && <Badge variant="success-soft">Current</Badge>}
          </div>
          <p className="mt-1 text-xs text-slate-500">{p.blurb}</p>
          <div className="mt-4 border-b border-slate-100 pb-4">
            <span className="font-display text-[26px] font-extrabold tracking-tight text-navy-950">
              {p.price}
            </span>
            <span className="ml-1.5 text-xs font-medium text-slate-400">{p.priceNote}</span>
          </div>
          <ul className="mt-4 flex-1 space-y-2.5">
            {p.features.map((f) => (
              <li key={f.label} className="flex items-start gap-2 text-[13px]">
                {f.included ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
                ) : (
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                )}
                <span className={f.included ? "text-slate-700" : "text-slate-400"}>{f.label}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-6"
            variant={p.popular ? "accent" : p.name === "Enterprise" ? "default" : "outline"}
            onClick={() => choose(p.name)}
          >
            {p.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}
