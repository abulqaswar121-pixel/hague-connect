import { motion } from "framer-motion";
import { Building2, HelpCircle } from "lucide-react";
import { PricingMatrix } from "@/components/sections/PricingMatrix";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const faqs = [
  {
    q: "When does billing start?",
    a: "Phase 1 is completely free for all tiers. Paid plans activate with the production launch; anyone who selects a paid plan during the preview gets 3 months free at launch.",
  },
  {
    q: "Can I switch between buyer and exporter roles?",
    a: "Yes — many Nigerian trading houses both buy and sell. Open a second workspace from your account menu, or contact the trade desk to enable a dual-role account.",
  },
  {
    q: "What payment methods will Corporate & Enterprise support?",
    a: "Cards, bank transfer (USD and NGN), and for Enterprise, monthly invoicing. Trade escrow (Phase 2) will additionally support LC-adjacent milestone releases.",
  },
  {
    q: "Does my subscription include verification?",
    a: "Professional includes Silver document verification; Corporate includes the Gold site inspection; Enterprise fast-tracks the Platinum certification audit. Upgrades never repeat checks already completed.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Annual plans can be cancelled with effect at the end of the term; downgrades take effect immediately and your data (RFQs, quotes, listings) is retained for 24 months.",
  },
];

export function Membership() {
  return (
    <div>
      <section className="bg-navy-950 text-white">
        <div className="container py-16 lg:py-20">
          <motion.span {...fade} transition={{ duration: 0.5, ease: EASE }} className="kicker-dark">
            <Building2 className="h-3.5 w-3.5" /> Membership
          </motion.span>
          <motion.h1 {...fade} transition={{ duration: 0.55, ease: EASE }} className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple annual pricing for serious traders
          </motion.h1>
          <motion.p {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Start free and upgrade when the deal flow justifies it. Every paid plan bundles the
            verification tier that actually moves buyer trust.
          </motion.p>
        </div>
      </section>

      <section className="section-pad bg-slate-50">
        <div className="container">
          <motion.div {...fade} transition={{ duration: 0.55, ease: EASE }}>
            <PricingMatrix />
          </motion.div>
          <motion.p {...fade} transition={{ duration: 0.5, ease: EASE }} className="mt-6 text-center text-xs text-slate-400">
            Prices in USD, billed annually. NGN billing available at the prevailing official rate at launch.
          </motion.p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container max-w-3xl">
          <motion.div {...fade} transition={{ duration: 0.5, ease: EASE }} className="text-center">
            <span className="kicker"><HelpCircle className="h-3.5 w-3.5" /> FAQ</span>
            <h2 className="h-section mt-4">Membership questions, answered</h2>
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.55, ease: EASE, delay: 0.1 }} className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="rounded-xl border border-slate-200 bg-white px-5 shadow-card data-[state=open]:border-vermilion-500/40"
                >
                  <AccordionTrigger className="py-4 text-left font-display text-[15px] font-bold text-navy-950 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-[13.5px] leading-relaxed text-slate-500">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
