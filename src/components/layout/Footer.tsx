import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpenText,
  HandCoins,
  LineChart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "./Header";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { commodities } from "@/data/commodities";
import { waLink, waMessages, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

const roadmap = [
  {
    icon: BookOpenText,
    name: "Hague Academy",
    desc: "Export-readiness training & certification",
    eta: "Q2 2026",
  },
  {
    icon: HandCoins,
    name: "Trade Escrow",
    desc: "Secured milestone payments on-platform",
    eta: "Q3 2026",
  },
  {
    icon: LineChart,
    name: "Price Intelligence",
    desc: "Daily FOB benchmarks & market signals",
    eta: "Q3 2026",
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* roadmap strip */}
      <div className="border-b border-white/10">
        <div className="container grid gap-4 py-8 md:grid-cols-3">
          {roadmap.map((r) => (
            <div key={r.name} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.04] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400">
                <r.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-bold">
                  {r.name}
                  <Badge variant="gold" className="text-[9px]">{r.eta}</Badge>
                </p>
                <p className="mt-0.5 text-xs text-white/50">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* main footer */}
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/40">
            Connect · Trade · Grow
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/50">
            The trust layer for African agro-commodity trade. Hague Export vets suppliers,
            structures RFQs and de-risks cross-border deals between verified Nigerian
            exporters and buyers in 62 countries.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/60">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Corporate Affairs Commission · RC-3789349
          </div>
          <div className="mt-4 flex gap-2">
            <Badge variant="outline" className="border-white/15 bg-transparent text-white/60">NEPC Trade Partner</Badge>
            <Badge variant="outline" className="border-white/15 bg-transparent text-white/60">NEXIM Aligned</Badge>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/40">Marketplace</h4>
          <ul className="mt-4 space-y-2.5 text-[13px] font-medium text-white/65">
            {commodities.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/product/${c.slug}`} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/marketplace" className="inline-flex items-center gap-1 font-bold text-vermilion-400 hover:text-vermilion-300">
                View all commodities <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/40">Platform</h4>
          <ul className="mt-4 space-y-2.5 text-[13px] font-medium text-white/65">
            <li><Link to="/how-it-works" className="transition-colors hover:text-white">How It Works</Link></li>
            <li><Link to="/verification" className="transition-colors hover:text-white">Verification System</Link></li>
            <li><Link to="/membership" className="transition-colors hover:text-white">Membership Plans</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-white">About Hague Export</Link></li>
            <li><Link to="/register" className="transition-colors hover:text-white">Become a Verified Exporter</Link></li>
            <li><Link to="/register" className="transition-colors hover:text-white">Open Buyer Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/40">Trade Support Desk</h4>
          <ul className="mt-4 space-y-3 text-[13px] font-medium text-white/65">
            <li>
              <a href={waLink(waMessages.support)} target="_blank" rel="noreferrer" className="group flex items-center gap-2.5 transition-colors hover:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/15 text-emerald-300">
                  <WhatsAppGlyph />
                </span>
                <span>
                  WhatsApp quick-link
                  <span className="block text-xs text-white/40">{WHATSAPP_DISPLAY}</span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Mail className="h-4 w-4" />
              </span>
              <span>
                tradedesk@hague-export.com
                <span className="block text-xs text-white/40">Response &lt; 4 business hours</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <Phone className="h-4 w-4" />
              </span>
              <span>
                +234 (0) 810 395 4351
                <span className="block text-xs text-white/40">Mon–Sat · 08:00–18:00 WAT</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60">
                <MapPin className="h-4 w-4" />
              </span>
              <span>
                Victoria Island, Lagos, Nigeria
                <span className="block text-xs text-white/40">Registered office</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* legal strip */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-[11.5px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 <span className="font-bold text-white/60">Hague Digital Solutions</span> (RC-3789349).
            All rights reserved. hague-export.com
          </p>
          <p className="max-w-xl leading-relaxed">
            Phase 1 demonstration build — marketplace data is illustrative; no live payments,
            logistics bookings or binding contracts are processed on this preview.
          </p>
        </div>
      </div>
    </footer>
  );
}
