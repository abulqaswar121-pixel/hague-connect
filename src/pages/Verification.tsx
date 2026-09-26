import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileBadge2,
  Globe2,
  Landmark,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationBadge } from "@/components/brand/VerificationBadge";
import { verificationTiers } from "@/data/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const checks = [
  { icon: Building2, title: "CAC registry lookup", body: "RC number, incorporation status, directors and registered address validated against Corporate Affairs Commission records." },
  { icon: FileBadge2, title: "NEPC license check", body: "Exporter registration certificate confirmed active with the Nigerian Export Promotion Council." },
  { icon: Landmark, title: "Bank & TIN match", body: "Corporate bank account and Tax Identification Number cross-matched to the registered entity." },
  { icon: ScanSearch, title: "Physical site inspection", body: "Hague field officers audit warehouses, processing lines and QC procedures at Gold tier and above." },
  { icon: ShieldCheck, title: "Trade reference calls", body: "Past buyers referenced for fulfilled volumes, quality consistency and dispute behaviour." },
  { icon: Globe2, title: "Sanctions & AML screen", body: "Entities screened against global sanctions, PEP and adverse-media databases before badge award." },
];

export function Verification() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <img src="/images/inspection.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/50" />
        <div className="container relative py-16 lg:py-20">
          <motion.span {...fade} transition={{ duration: 0.5, ease: EASE }} className="kicker-dark">
            <ShieldCheck className="h-3.5 w-3.5" /> Verification framework
          </motion.span>
          <motion.h1 {...fade} transition={{ duration: 0.55, ease: EASE }} className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Four tiers. Zero tolerance for trade fraud.
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Every supplier badge on Hague Export represents real, documented checks — from CAC
            registry lookups to boots-on-the-ground warehouse audits. Buyers filter by badge;
            exporters climb tiers to win larger contracts.
          </motion.p>
          <motion.div {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.2 }} className="mt-6 flex flex-wrap gap-2.5">
            {verificationTiers.map((t) => (
              <VerificationBadge key={t.id} tier={t.id} size="lg" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* tier ladder */}
      <section className="section-pad bg-slate-50">
        <div className="container">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="max-w-2xl">
            <span className="kicker">The ladder</span>
            <h2 className="h-section mt-4">What each tier certifies</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {verificationTiers.map((t, i) => (
              <motion.div key={t.id} {...fade} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <VerificationBadge tier={t.id} size="lg" />
                      <span className="font-display text-xs font-bold text-slate-300">TIER {i + 1}/4</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{t.tagline}</h3>
                    <div className="mt-4 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Requirements</p>
                        <ul className="mt-2 space-y-1.5">
                          {t.requirements.map((r) => (
                            <li key={r} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-600">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vermilion-600" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">What it unlocks</p>
                        <ul className="mt-2 space-y-1.5">
                          {t.perks.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-600">
                              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* verification engine */}
      <section className="section-pad bg-white">
        <div className="container">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="mx-auto max-w-2xl text-center">
            <span className="kicker">Under the hood</span>
            <h2 className="h-section mt-4">Six checks behind every badge</h2>
            <p className="sub-section mx-auto">
              Our verification office in Lagos runs a documented audit trail on every supplier —
              re-validated on a rolling basis.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((c, i) => (
              <motion.div
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all hover:border-vermilion-500/40 hover:bg-white hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-[15px] font-bold text-navy-950">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-navy-950 p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left"
          >
            <div>
              <h3 className="font-display text-xl font-bold">Exporting from Nigeria? Get verified.</h3>
              <p className="mt-1 max-w-xl text-sm text-white/55">
                Bronze is instant. Silver typically completes in 48 hours once your CAC &amp; NEPC
                documents are uploaded.
              </p>
            </div>
            <Button variant="accent" size="lg" className="shrink-0" onClick={() => navigate("/register?role=exporter")}>
              Start Verification <ArrowRight />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
