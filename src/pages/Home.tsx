import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  Building2,
  FileSearch,
  Globe2,
  Quote,
  Search,
  Ship,
  ShieldCheck,
  Store,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommodityCard } from "@/components/CommodityCard";
import { VerificationPillars } from "@/components/sections/VerificationPillars";
import { HowItWorksFlow } from "@/components/sections/HowItWorksFlow";
import { PricingMatrix } from "@/components/sections/PricingMatrix";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { useAllCommodities } from "@/store/listings";
import { categories } from "@/data/commodities";
import { destinationPorts, stats, testimonials } from "@/data/content";
import { waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: EASE },
};

export function Home() {
  const navigate = useNavigate();
  const all = useAllCommodities();
  const [category, setCategory] = useState("all");
  const [dest, setDest] = useState("any");
  const [q, setQ] = useState("");

  const featured = all.filter((c) => c.featured).slice(0, 8);

  function search(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category !== "all") params.set("category", category);
    if (dest !== "any") params.set("port", dest);
    navigate(`/marketplace?${params.toString()}`);
  }

  return (
    <div>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Container port at Apapa, Lagos"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
          <div className="absolute inset-0 bg-grid-navy [background-size:44px_44px] opacity-60" />
        </div>

        <div className="container relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="kicker-dark">
                <ShieldCheck className="h-3.5 w-3.5" />
                Nigeria's verified B2B agro-export gateway
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Verified African commodities.{" "}
              <span className="bg-gradient-to-r from-brandblue-400 via-vermilion-400 to-gold-400 bg-clip-text text-transparent">
                Global buyers.
              </span>{" "}
              Zero guesswork.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-base"
            >
              Hague Export connects international buyers to CAC &amp; NEPC-verified Nigerian
              exporters of sesame, cashew, cocoa, ginger, hibiscus and more — with structured RFQs,
              third-party inspection and a 4-tier trust system engineered to eliminate trade fraud.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Button variant="accent" size="xl" onClick={() => navigate("/marketplace")}>
                <Search /> Source African Commodities
              </Button>
              <Button variant="outline-light" size="xl" onClick={() => navigate("/register?role=exporter")}>
                <Store /> List Export Products
              </Button>
            </motion.div>

            {/* search console */}
            <motion.form
              onSubmit={search}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="glass-dark mt-9 grid gap-2 rounded-2xl p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center"
            >
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-950/60 px-3 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-white/40" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search commodities… e.g. sesame"
                  className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/35 focus:outline-none"
                />
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-white/10 bg-navy-950/60 text-white [&>span]:text-white/85">
                  <SelectValue placeholder="Commodity category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dest} onValueChange={setDest}>
                <SelectTrigger className="border-white/10 bg-navy-950/60 text-white [&>span]:text-white/85">
                  <Anchor className="h-4 w-4 text-white/40" />
                  <SelectValue placeholder="Destination port" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any destination</SelectItem>
                  {destinationPorts.map((d) => (
                    <SelectItem key={d.port} value={d.port}>
                      {d.port} — {d.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
                Search Market
              </Button>
            </motion.form>

            {/* quick stats */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
            >
              {[
                ["Verified exporters", stats.exporters],
                ["Commodity categories", stats.commodities],
                ["Destination countries", stats.countries],
                ["Volume facilitated", stats.mtTraded],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-vermilion-600/60 pl-3">
                  <dt className="text-[10.5px] font-bold uppercase tracking-wider text-white/40">{k}</dt>
                  <dd className="mt-1 font-display text-xl font-extrabold text-white">{v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-5">
          {[
            [ShieldCheck, "4-tier supplier verification", "text-vermilion-600"],
            [FileSearch, "SGS / Bureau Veritas inspections", "text-brandblue-600"],
            [BadgeCheck, "CAC & NEPC records validated", "text-gold-600"],
            [Ship, "FOB · CIF · CFR terms supported", "text-vermilion-600"],
          ].map(([Icon, label, cls]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <span key={label as string} className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                <I className={cn("h-4 w-4", cls as string)} /> {label as string}
              </span>
            );
          })}
        </div>
      </section>

      {/* ===================== WHY HAGUE EXPORT ===================== */}
      <section className="section-pad bg-navy-950 text-white">
        <div className="container">
          <motion.div {...fade} className="max-w-2xl">
            <span className="kicker-dark"><ShieldCheck className="h-3.5 w-3.5" /> Why Hague Export</span>
            <h2 className="h-section-dark mt-4">The 4-tier trust system built to eliminate trade fraud</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/55">
              Cross-border agro trade fails on trust. Every supplier on Hague Export climbs a
              verification ladder — from basic identity checks to full international trade
              certification — so buyers know exactly who they're wiring money to.
            </p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="mt-10">
            <VerificationPillars />
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURED COMMODITIES ==================== */}
      <section className="section-pad bg-slate-50">
        <div className="container">
          <motion.div {...fade} className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="kicker"><TrendingUp className="h-3.5 w-3.5" /> Featured commodities</span>
              <h2 className="h-section mt-4">In-season, inspected, export-ready</h2>
              <p className="sub-section">
                Live indicative FOB pricing with full technical specifications — every listing backed
                by a badge-verified supplier and inspection-ready stock.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/marketplace")}>
              Browse full marketplace <ArrowRight />
            </Button>
          </motion.div>
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
            className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {featured.map((c) => (
              <CommodityCard key={c.id} c={c} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== HOW IT WORKS ======================== */}
      <section className="section-pad bg-white">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <span className="kicker"><Globe2 className="h-3.5 w-3.5" /> How it works</span>
            <h2 className="h-section mt-4">From search to shipped in four structured steps</h2>
            <p className="sub-section mx-auto">
              A disciplined workflow replaces WhatsApp guesswork — structured RFQs, comparable
              quotes, certified inspection and documented contracts.
            </p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="mt-12">
            <HowItWorksFlow />
          </motion.div>
          <motion.div {...fade} className="mt-10 text-center">
            <Link to="/how-it-works" className="text-sm font-bold text-vermilion-600 hover:text-vermilion-500">
              Read the full playbook for buyers &amp; exporters →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ======================= */}
      <section className="section-pad bg-navy-950 text-white">
        <div className="container">
          <motion.div {...fade} className="max-w-2xl">
            <span className="kicker-dark"><Quote className="h-3.5 w-3.5" /> Trade voices</span>
            <h2 className="h-section-dark mt-4">Trusted on both sides of the trade lane</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[.04] p-6"
              >
                <Quote className="h-6 w-6 text-vermilion-500" />
                <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-white/70">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="mt-0.5 text-xs text-white/45">
                    {t.role} · {t.country}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== MEMBERSHIP PRICING ==================== */}
      <section className="section-pad bg-slate-50">
        <div className="container">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <span className="kicker"><Building2 className="h-3.5 w-3.5" /> Membership</span>
            <h2 className="h-section mt-4">Plans that scale with your trade book</h2>
            <p className="sub-section mx-auto">
              Start free. Upgrade as volumes grow — every paid tier includes the verification
              upgrade that unlocks buyer trust.
            </p>
          </motion.div>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }} className="mt-12">
            <PricingMatrix />
          </motion.div>
        </div>
      </section>

      {/* ============================ CTA BAND ======================== */}
      <section className="relative overflow-hidden bg-vermilion-600">
        <div className="absolute inset-0 bg-gradient-to-br from-vermilion-600 via-vermilion-700 to-navy-950" />
        <div className="absolute inset-0 bg-grid-navy [background-size:44px_44px] opacity-40" />
        <div className="container relative flex flex-col items-center gap-6 py-16 text-center text-white">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            Ready to trade with confidence? Connect. Trade. Grow.
          </h2>
          <p className="max-w-xl text-[15px] text-white/80">
            Join 480+ verified exporters and buyers across 62 countries already structuring
            deals on Hague Export.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="xl" className="bg-navy-950 text-white hover:bg-navy-900" onClick={() => navigate("/register")}>
              Create Free Account <ArrowRight />
            </Button>
            <WhatsAppButton message={waMessages.general} size="xl" className="bg-[#25D366] hover:bg-[#1eb856]">
              Chat With Trade Desk
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
