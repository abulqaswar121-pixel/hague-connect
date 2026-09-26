import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  FileBadge,
  Globe2,
  KeyRound,
  Mail,
  Package2,
  Ship,
  UserRound,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/layout/Header";
import { useAuth } from "@/store/auth";
import { commodities } from "@/data/commodities";
import { destinationCountries } from "@/data/content";
import { sleep, cn } from "@/lib/utils";
import type { Role } from "@/types";

export function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signUp = useAuth((s) => s.signUp);

  const [role, setRole] = useState<Role>(
    params.get("role") === "exporter" ? "exporter" : "buyer"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState(role === "buyer" ? "Germany" : "Nigeria");
  const [rcNumber, setRcNumber] = useState("");
  const [commodity, setCommodity] = useState(commodities[0].name);
  const [loading, setLoading] = useState(false);

  const planParam = params.get("plan");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !email.includes("@") || password.length < 4 || company.trim().length < 2) {
      toast.error("Almost there", {
        description: "Please complete name, valid email, password (4+) and company name.",
      });
      return;
    }
    setLoading(true);
    await sleep(1400);
    const user = signUp({
      name: name.trim(),
      email,
      company: company.trim(),
      country: role === "exporter" ? "Nigeria" : country,
      role,
      rcNumber: role === "exporter" ? rcNumber || undefined : undefined,
      primaryCommodity: role === "exporter" ? commodity : undefined,
    });
    toast.success("Account created — welcome aboard", {
      description: `${user.company} is live with a Free plan${planParam ? ` · ${planParam} upgrade request noted` : ""}. Start by browsing ${role === "exporter" ? "incoming RFQs" : "the marketplace"}.`,
    });
    navigate(role === "buyer" ? "/dashboard/buyer" : "/dashboard/exporter");
  }

  return (
    <div className="grid min-h-[calc(100vh-96px)] lg:grid-cols-2">
      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <img src="/images/hero.jpg" alt="Port" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/80 to-navy-950" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo />
          <div>
            <h2 className="max-w-md font-display text-3xl font-extrabold leading-tight">
              Your trade gateway starts with a verified identity.
            </h2>
            <div className="mt-8 space-y-5">
              {[
                ["01", "Create your account", "Free forever tier — no card required for Phase 1."],
                ["02", "Verify your business", "CAC & NEPC checks unlock buyer trust and the Silver badge."],
                ["03", "Trade with structure", "RFQs, comparable quotes, inspection-ready contracts."],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-4">
                  <span className="font-display text-sm font-extrabold text-vermilion-400">{n}</span>
                  <div>
                    <p className="text-sm font-bold">{t}</p>
                    <p className="mt-0.5 max-w-sm text-[13px] text-white/55">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-white/35">
            Hague Digital Solutions · RC-3789349 — Connect. Trade. Grow.
          </p>
        </div>
      </div>

      {/* form side */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <img
            src="/brand/logo-full.png"
            alt="Hague Import & Export"
            className="mb-6 h-24 w-auto"
          />
          <span className="kicker"><UserPlus className="h-3.5 w-3.5" /> Free registration</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-navy-950">
            Create your trade account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {planParam
              ? `Selected plan: ${planParam} — registration is free, billing starts in Phase 2.`
              : "Choose your side of the trade lane — you can upgrade either later."}
          </p>

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
                  role === r.id ? "bg-navy-950 text-white shadow" : "text-slate-500 hover:text-navy-950"
                )}
              >
                <r.icon className="h-4 w-4" /> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-name">Full name</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chiamaka Eze" className="pl-9" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="r-email">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-pass">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="r-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 4 chars (preview)" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-company">Company name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="r-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={role === "buyer" ? "e.g. Meridian Foods GmbH" : "e.g. Zuma Agro Exports Ltd"}
                  className="pl-9"
                />
              </div>
            </div>

            {role === "buyer" ? (
              <div className="space-y-2">
                <Label>Country of operation</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {destinationCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="rounded-xl border border-vermilion-500/25 bg-vermilion-50/60 p-4">
                <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-vermilion-700">
                  <Ship className="h-3.5 w-3.5" /> Exporter verification details
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="r-rc">CAC / RC number</Label>
                    <div className="relative">
                      <FileBadge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="r-rc"
                        value={rcNumber}
                        onChange={(e) => setRcNumber(e.target.value)}
                        placeholder="RC-1234567"
                        className="bg-white pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary export commodity</Label>
                    <div className="relative">
                      <Select value={commodity} onValueChange={setCommodity}>
                        <SelectTrigger className="bg-white">
                          <Package2 className="h-4 w-4 text-slate-400" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {commodities.map((c) => (
                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Your RC number is validated against CAC records during Silver verification — demo
                  accounts can proceed instantly.
                </p>
              </div>
            )}

            <Button type="submit" variant="accent" size="lg" className="w-full" isLoading={loading}>
              {loading ? "Creating your workspace…" : "Create account & open dashboard"} <ArrowRight />
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              By registering you accept the Hague Export Trade Terms and acknowledge this is a
              Phase 1 demonstration environment.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/sign-in" className="font-bold text-vermilion-600 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
