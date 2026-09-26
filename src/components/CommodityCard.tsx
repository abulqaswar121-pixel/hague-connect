import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Package2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price, PriceChange } from "@/components/brand/Price";
import { VerificationBadge } from "@/components/brand/VerificationBadge";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { useUi } from "@/store/ui";
import { suppliers } from "@/data/suppliers";
import { tierRank } from "@/data/content";
import { waMessages } from "@/lib/whatsapp";
import type { Commodity } from "@/types";
import { cn } from "@/lib/utils";

export function topSupplierFor(c: Commodity) {
  const list = suppliers.filter((s) => c.supplierIds.includes(s.id));
  if (!list.length) return undefined;
  return list.sort((a, b) => tierRank[b.badge] - tierRank[a.badge])[0];
}

export function CommodityCard({ c }: { c: Commodity }) {
  const openRfq = useUi((s) => s.openRfq);
  const top = topSupplierFor(c);

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/product/${c.slug}`} className="relative block h-44 overflow-hidden bg-navy-900">
        {c.image ? (
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-800 to-navy-950 text-white/70">
            <Package2 className="h-8 w-8" />
            <span className="text-xs font-semibold">Image pending verification</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950/80 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge className="bg-navy-950/80 backdrop-blur-sm border border-white/10">{c.category}</Badge>
          {c.featured && (
            <Badge variant="gold" className="gap-1">
              <Sparkles className="h-3 w-3" /> Featured
            </Badge>
          )}
          {c.isCustom && <Badge variant="success">New Listing</Badge>}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Indicative FOB Apapa
            </p>
            <p className="flex items-baseline gap-2">
              <Price usd={c.fobUsd} amountClassName="text-white text-lg" suffix="/MT" className="[&_.text-slate-400]:text-white/50" />
              <PriceChange pct={c.priceChangePct} className="[&.text-emerald-600]:text-emerald-300 [&.text-red-500]:text-red-300" />
            </p>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            to={`/product/${c.slug}`}
            className="font-display text-[15px] font-bold leading-snug text-navy-950 transition-colors hover:text-vermilion-600"
          >
            {c.name}
          </Link>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{c.grade}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Package2 className="h-3.5 w-3.5 text-slate-400" />
            MOQ <b className="text-navy-900">{c.moqMt} MT</b>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {c.origin.slice(0, 2).join(" · ")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {top && !c.isCustom ? (
            <VerificationBadge tier={top.badge} size="sm" />
          ) : (
            <Badge variant="muted">Verification in progress</Badge>
          )}
          <span className="text-[10px] font-medium text-slate-400">
            {c.packaging[0]} · via {c.ports[0]}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button variant="accent" size="sm" className="flex-1" onClick={() => openRfq(c)}>
            Request Quote <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <WhatsAppButton
            message={waMessages.product(c.name, c.hsCode, c.moqMt)}
            size="sm"
            variant="outline"
            className="border-[#25D366]/40 text-[#128C4B] hover:bg-[#25D366]/10 px-2.5"
            aria-label="WhatsApp inquiry"
          >
            <span className="sr-only">WhatsApp</span>
          </WhatsAppButton>
        </div>
      </div>
    </Card>
  );
}
