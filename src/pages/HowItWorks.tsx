import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  FileSearch,
  Globe2,
  Handshake,
  Ship,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorksFlow } from "@/components/sections/HowItWorksFlow";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { waMessages } from "@/lib/whatsapp";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const buyerNotes = [
  { icon: FileSearch, title: "Structured RFQs, not DMs", body: "Quantity, Incoterm, destination, target price and inspection specs are captured up-front, so supplier quotes arrive comparable — apples to apples." },
  { icon: ShieldCheck, title: "Trust is pre-built", body: "You only negotiate with suppliers whose CAC, NEPC and (at higher tiers) physical operations have already been vetted." },
  { icon: Handshake, title: "Contracts & escrow roadmap", body: "Hague-standard proforma contracts today; milestone escrow payments land with Phase 2 to remove payment risk entirely." },
];

const exporterNotes = [
  { icon: Globe2, title: "Demand finds you", body: "Verified buyers across 62 countries broadcast RFQs for sesame, cashew, cocoa and more — your dashboard is the feed." },
  { icon: Compass, title: "Quote in minutes", body: "The quote composer computes contract value as you type and transmits a professional offer the buyer can accept in one click." },
  { icon: Store, title: "Your trade record compounds", body: "Response rate, shipments and ratings accumulate against your badge — climbing tiers makes every next deal easier." },
];

export function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 bg-grid-navy [background-size:44px_44px]" />
        <div className="container relative py-16 lg:py-20">
          <motion.span {...fade} transition={{ duration: 0.5, ease: EASE }} className="kicker-dark">
            <Ship className="h-3.5 w-3.5" /> The Hague workflow
          </motion.span>
          <motion.h1 {...fade} transition={{ duration: 0.55, ease: EASE }} className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            How Hague Export works, dock to door
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Cross-border agro trade is traditionally run on WhatsApp chats and blind trust.
            We replaced it with a disciplined, documented flow — so a buyer in Hamburg and an
            exporter in Kano can transact like they've worked together for years.
          </motion.p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="max-w-2xl">
            <span className="kicker">Four steps</span>
            <h2 className="h-section mt-4">The standard trade flow</h2>
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-10">
            <HowItWorksFlow />
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-slate-50">
        <div className="container grid gap-12 lg:grid-cols-2">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }}>
            <span className="kicker"><Globe2 className="h-3.5 w-3.5" /> For buyers</span>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Source without the sourcing risk</h2>
            <div className="mt-6 space-y-4">
              {buyerNotes.map((n) => (
                <div key={n.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-white">
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-navy-950">{n.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="accent" className="mt-6" onClick={() => navigate("/register")}>
              Open a Buyer Account <ArrowRight />
            </Button>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
            <span className="kicker"><Ship className="h-3.5 w-3.5" /> For exporters</span>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Sell to the world, professionally</h2>
            <div className="mt-6 space-y-4">
              {exporterNotes.map((n) => (
                <div key={n.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vermilion-600 text-white">
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-navy-950">{n.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="default" className="mt-6" onClick={() => navigate("/register?role=exporter")}>
              Become a Verified Exporter <ArrowRight />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="bg-vermilion-600">
        <div className="container flex flex-col items-center gap-5 py-14 text-center text-white">
          <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight">
            See it live — submit a demo RFQ in under two minutes
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-navy-950 text-white hover:bg-navy-900" onClick={() => navigate("/marketplace")}>
              Browse the Marketplace <ArrowRight />
            </Button>
            <WhatsAppButton message={waMessages.general} size="lg">
              Ask the Trade Desk
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
