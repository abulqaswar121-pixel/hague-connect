import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Building2, Globe2, KeyRound, LogIn, Mail, Ship, UserRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Header";
import { useAuth, DEMO_BUYER, DEMO_EXPORTER } from "@/store/auth";
import { sleep, cn } from "@/lib/utils";
import type { Role } from "@/types";

export function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const demoSignIn = useAuth((s) => s.demoSignIn);

  const [role, setRole] = useState<Role>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<null | "form" | "buyer" | "exporter">(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      toast.error("Check your credentials", {
        description: "Enter a valid email and any password of 4+ characters (preview mode).",
      });
      return;
    }
    setLoading("form");
    await sleep(1100);
    const user = signIn(email, role);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}`, {
      description: `Signed in to the ${role === "buyer" ? "Buyer" : "Exporter"} workspace as ${user.company}.`,
    });
    navigate(role === "buyer" ? "/dashboard/buyer" : "/dashboard/exporter");
  }

  async function demo(r: Role) {
    setLoading(r);
    await sleep(900);
    const user = demoSignIn(r);
    toast.success(`Demo session started`, {
      description: `${user.name} · ${user.company} — preloaded with live trade data.`,
    });
    navigate(r === "buyer" ? "/dashboard/buyer" : "/dashboard/exporter");
  }

  return (
    <div className="grid min-h-[calc(100vh-96px)] lg:grid-cols-2">
      {/* form side */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <img
            src="/brand/logo-full.png"
            alt="Hague Import & Export"
            className="mb-6 h-24 w-auto"
          />
          <span className="kicker"><LogIn className="h-3.5 w-3.5" /> Secure access</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-950">
            Sign in to Hague Export
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Phase 1 preview — any valid email &amp; password opens a live workspace, or jump in with a demo preset.
          </p>

          {/* role toggle */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">
            {(
              [
                { id: "buyer", label: "International Buyer", icon: Globe2 },
                { id: "exporter", label: "African Exporter", icon: Ship },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-bold transition-all",
                  role === r.id
                    ? "bg-navy-950 text-white shadow"
                    : "text-slate-500 hover:text-navy-950"
                )}
              >
                <r.icon className="h-4 w-4" /> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "buyer" ? "you@tradingcompany.com" : "you@nigerianexport.ng"}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs font-semibold text-vermilion-600 hover:underline"
                  onClick={() => toast.info("Password reset arrives with production auth in Phase 2.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any 4+ characters (preview)"
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full" isLoading={loading === "form"}>
              {loading === "form" ? "Verifying credentials…" : `Sign in as ${role === "buyer" ? "Buyer" : "Exporter"}`}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> One-click demo presets <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              onClick={() => demo("exporter")}
              disabled={!!loading}
              className="group rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all hover:border-vermilion-500/50 hover:shadow-card disabled:opacity-60"
            >
              <div className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
                <Zap className="h-4 w-4 text-gold-500" />
                Top-Tier Exporter
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {DEMO_EXPORTER.name} · {DEMO_EXPORTER.company} — Corporate plan, Gold verified
              </p>
              {loading === "exporter" && <p className="mt-1.5 text-xs font-bold text-vermilion-600">Starting session…</p>}
            </button>
            <button
              onClick={() => demo("buyer")}
              disabled={!!loading}
              className="group rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all hover:border-vermilion-500/50 hover:shadow-card disabled:opacity-60"
            >
              <div className="flex items-center gap-2 text-[13px] font-bold text-navy-950">
                <Zap className="h-4 w-4 text-gold-500" />
                Global Commodity Buyer
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {DEMO_BUYER.name} · {DEMO_BUYER.company} — {DEMO_BUYER.tier} plan, active RFQs &amp; quotes
              </p>
              {loading === "buyer" && <p className="mt-1.5 text-xs font-bold text-vermilion-600">Starting session…</p>}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to Hague Export?{" "}
            <Link to="/register" className="font-bold text-vermilion-600 hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <img src="/images/inspection.jpg" alt="Cargo inspection" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo />
          <div>
            <h2 className="max-w-md font-display text-3xl font-extrabold leading-tight">
              One login. Both sides of the trade lane.
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                [Building2, "Exporters", "Manage RFQs, send structured quotes and grow a verified trade record.", "text-gold-400"],
                [Globe2, "Buyers", "Broadcast RFQs to badge-verified suppliers and compare competing quotes.", "text-brandblue-400"],
                [UserRound, "Trade desk", "Human support on WhatsApp at every step of the transaction.", "text-vermilion-400"],
              ].map(([Icon, t, d, cls]) => {
                const I = Icon as typeof Building2;
                return (
                  <li key={t as string} className="flex gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <I className={cn("h-5 w-5", cls as string)} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t as string}</p>
                      <p className="mt-0.5 max-w-sm text-[13px] text-white/55">{d as string}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-[11px] text-white/35">
            Hague Digital Solutions · RC-3789349 · Lagos, Nigeria — Connect. Trade. Grow.
          </p>
        </div>
      </div>
    </div>
  );
}
