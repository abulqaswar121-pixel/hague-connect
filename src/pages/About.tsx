import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Eye,
  Landmark,
  Mail,
  MapPin,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { waMessages, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const milestones = [
  ["2024", "Hague Digital Solutions incorporated in Lagos (RC-3789349) after two years brokering sesame deals off-platform."],
  ["2025", "Pilot cohort: 40 exporters across Kano, Oyo and Cross River; ₦ equivalent of $18M in structured RFQs processed manually."],
  ["2026", "Hague Export Phase 1 preview launches — verification framework, RFQ engine and role-based dashboards go live."],
  ["Roadmap", "Hague Academy (Q2), Trade Escrow & Price Intelligence (Q3), mobile apps and Francophone West Africa expansion (Q4)."],
];

const leadership = [
  { initials: "HQ", name: "H. Qaswar", role: "Founder & Chief Executive", focus: "Trade operations & partnerships" },
  { initials: "AA", name: "A. Adeyemi", role: "Head of Verification", focus: "Supplier audits & compliance" },
  { initials: "CO", name: "C. Obi", role: "Head of Product", focus: "Platform & trade tooling" },
  { initials: "FM", name: "F. Musa", role: "Trade Desk Lead", focus: "Buyer–supplier success" },
];

const partners = ["NEPC", "NEXIM Bank", "Afreximbank Trade Club", "NACCIMA", "SGS Nigeria", "Lagos Chamber of Commerce"];

export function About() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <img src="/images/warehouse.jpg" onError={(e) => ((e.target as HTMLImageElement).src = "/images/inspection.jpg")} alt="Hague Export warehouse operations" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/40" />
        <div className="container relative py-16 lg:py-20">
          <motion.span {...fade} transition={{ duration: 0.5, ease: EASE }} className="kicker-dark">
            <Landmark className="h-3.5 w-3.5" /> About Hague Export
          </motion.span>
          <motion.h1 {...fade} transition={{ duration: 0.55, ease: EASE }} className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built in Lagos. Trusted from Hamburg to Ho Chi Minh City.
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Hague Export is the trade infrastructure product of{" "}
            <b className="text-white">Hague Digital Solutions (RC-3789349)</b>. We started as
            commodity brokers and learned the hard way that African agro trade doesn't lack
            supply or demand — it lacks <b className="text-white">trust infrastructure</b>.
            So we built it.
          </motion.p>
        </div>
      </section>

      {/* mission / vision */}
      <section className="section-pad bg-white">
        <div className="container grid gap-5 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our Mission",
              body: "To make sourcing verified African commodities as safe and structured as buying from a domestic supplier — by combining rigorous verification, disciplined trade workflows and a human trade desk that answers on WhatsApp.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              body: "A continent where every legitimate exporter — from a Kano sesame cooperative to a Cross River cocoa estate — can reach global buyers on the strength of a verified track record, not connections.",
            },
          ].map((m, i) => (
            <motion.div key={m.title} {...fade} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white", i === 0 ? "bg-vermilion-600" : "bg-brandblue-600")}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold text-navy-950">{m.title}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{m.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* timeline */}
      <section className="section-pad bg-slate-50">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }}>
            <span className="kicker"><Compass className="h-3.5 w-3.5" /> Our journey</span>
            <h2 className="h-section mt-4">From broker desks to trade infrastructure</h2>
            <p className="sub-section">
              Hague Export is Phase 1 of a larger build. The roadmap below ships in quarters,
              not years.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <img src="/brand/logo-full.png" alt="Hague Import & Export" className="mb-4 h-20 w-auto" />
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Registered entity
              </p>
              <p className="mt-2 font-display text-lg font-bold text-navy-950">
                Hague Digital Solutions Ltd
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="navy">RC-3789349</Badge>
                <Badge variant="outline">Lagos, Nigeria</Badge>
                <Badge variant="gold-soft">hague-export.com</Badge>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-slate-200" />
            <div className="space-y-6">
              {milestones.map(([year, body], i) => (
                <motion.div
                  key={year}
                  {...fade}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                  className="relative flex gap-5 pl-1"
                >
                  <span className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-slate-50 ${i === milestones.length - 1 ? "bg-gold-500" : "bg-vermilion-600"}`} />
                  <div>
                    <p className="font-display text-sm font-extrabold text-navy-950">{year}</p>
                    <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-slate-600">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* leadership */}
      <section className="section-pad bg-white">
        <div className="container">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="max-w-2xl">
            <span className="kicker">Leadership</span>
            <h2 className="h-section mt-4">The team behind the trade desk</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((p, i) => (
              <motion.div
                key={p.name}
                {...fade}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 font-display text-lg font-extrabold text-white transition-colors group-hover:bg-vermilion-600">
                  {p.initials}
                </div>
                <h3 className="mt-4 font-display text-[15px] font-bold text-navy-950">{p.name}</h3>
                <p className="text-xs font-bold text-vermilion-600">{p.role}</p>
                <p className="mt-1.5 text-xs text-slate-500">{p.focus}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="mt-12">
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              Working alongside Nigeria's trade ecosystem
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {partners.map((p) => (
                <span key={p} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* contact band */}
      <section className="bg-navy-950 text-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Talk to a human trade desk</h2>
            <p className="mt-2 max-w-xl text-[15px] text-white/55">
              Sourcing a vessel-load, listing a new commodity line, or scoping an Enterprise plan —
              the desk answers in under 4 business hours.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/65">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-vermilion-400" /> Victoria Island, Lagos</span>
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-vermilion-400" /> tradedesk@hague-export.com</span>
              <span className="inline-flex items-center gap-2"><Landmark className="h-4 w-4 text-vermilion-400" /> RC-3789349</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <WhatsAppButton message={waMessages.support} size="lg" className="w-full">
              WhatsApp {WHATSAPP_DISPLAY}
            </WhatsAppButton>
            <Button variant="outline-light" size="lg" className="w-full" onClick={() => navigate("/register")}>
              Create Free Account <ArrowRight />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
