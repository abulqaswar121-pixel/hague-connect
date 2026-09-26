import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileCheck2,
  LineChart,
  MapPin,
  Package2,
  ShieldCheck,
  Ship,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/misc";
import { Price, PriceChange } from "@/components/brand/Price";
import { NepcChip, VerificationBadge } from "@/components/brand/VerificationBadge";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { CommodityCard } from "@/components/CommodityCard";
import { useAllCommodities } from "@/store/listings";
import { suppliers } from "@/data/suppliers";
import { useUi } from "@/store/ui";
import { usePrefs } from "@/store/prefs";
import { fmtMoney, fmtNum } from "@/lib/format";
import { waMessages } from "@/lib/whatsapp";

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const all = useAllCommodities();
  const openRfq = useUi((s) => s.openRfq);
  const currency = usePrefs((s) => s.currency);

  const c = all.find((x) => x.slug === slug);

  if (!c) {
    return (
      <div className="container flex flex-col items-center py-28 text-center">
        <Package2 className="h-12 w-12 text-slate-300" />
        <h1 className="mt-4 font-display text-2xl font-bold text-navy-950">Listing not found</h1>
        <p className="mt-2 text-sm text-slate-500">This commodity may have been delisted or the link is outdated.</p>
        <Button variant="accent" className="mt-6" onClick={() => navigate("/marketplace")}>
          Back to Marketplace <ArrowRight />
        </Button>
      </div>
    );
  }

  const productSuppliers = suppliers.filter((s) => c.supplierIds.includes(s.id));
  const primary = productSuppliers[0];
  const related = all.filter((x) => x.category === c.category && x.id !== c.id).slice(0, 3);
  const up = c.priceChangePct >= 0;

  return (
    <div>
      {/* breadcrumb + title band */}
      <section className="border-b border-white/10 bg-navy-950 text-white">
        <div className="container py-8">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-white/45">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/marketplace" className="hover:text-white">Marketplace</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">{c.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{c.name}</h1>
            <Badge variant="gold" className="font-mono text-[11px]">HS {c.hsCode}</Badge>
            {primary && <VerificationBadge tier={primary.badge} />}
            {c.isCustom && <Badge variant="success">Community listing</Badge>}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-white/55">{c.grade}</p>
        </div>
      </section>

      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* left column */}
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-card">
              {c.image ? (
                <img src={c.image} alt={c.name} className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 text-white/60">
                  <Package2 className="h-12 w-12" />
                </div>
              )}
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge className="border border-white/10 bg-navy-950/80 backdrop-blur">{c.category}</Badge>
                {c.featured && <Badge variant="gold">Featured Export Line</Badge>}
              </div>
            </div>

            {/* tech spec sheet */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-vermilion-600" /> Technical Specification Sheet
                </CardTitle>
                <Badge variant="muted">Crop year 2025/26</Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Quality designation", c.grade],
                        ["HS classification", `${c.hsCode} (Nigeria export schedule)`],
                        ["Origin cluster", c.origin.join(", ")],
                        ["Harvest / supply window", c.harvestSeason],
                        ...c.specs.map((s) => [s.label, s.value] as string[]),
                        ["Packaging options", c.packaging.join(" · ")],
                        ["Loading capacity", `≈ ${c.moqMt >= 50 ? "100" : c.name.includes("Cashew") ? "26" : "24"} MT per 20ft FCL`],
                      ].map(([k, v], i) => (
                        <tr key={k} className={i % 2 ? "bg-slate-50/70" : "bg-white"}>
                          <td className="w-1/3 border-b border-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                            {k}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-2.5 font-semibold text-navy-950">
                            {v}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* description */}
            <Card>
              <CardHeader><CardTitle>Commodity Brief</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-[14px] leading-relaxed text-slate-600">
                <p>{c.description}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [Boxes, "MOQ", `${c.moqMt} MT trial order`],
                    [Ship, `via ${c.ports.join(" / ")}`, `${c.incoterms.join("/")} terms`],
                    [CalendarDays, c.harvestSeason.split("(")[0], "current season window"],
                  ].map(([Icon, a, b]) => {
                    const I = Icon as typeof Boxes;
                    return (
                      <div key={a as string} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                        <I className="h-4 w-4 text-vermilion-600" />
                        <p className="mt-2 text-[13px] font-bold text-navy-950">{a as string}</p>
                        <p className="text-xs text-slate-500">{b as string}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* supplier roster */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-vermilion-600" /> Verified Suppliers of this Commodity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {productSuppliers.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Supplier verification in progress for this community listing. Submit an RFQ and
                    our trade desk will match you manually.
                  </p>
                )}
                {productSuppliers.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-vermilion-500/40 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 font-display text-sm font-extrabold text-white">
                      {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-navy-950">{s.name}</p>
                        <VerificationBadge tier={s.badge} size="sm" />
                        {s.nepc && <NepcChip className="px-2 py-0.5 text-[10px]" />}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.state}, Nigeria · {s.rcNumber}</span>
                        <span className="inline-flex items-center gap-1"><Ship className="h-3 w-3" /> {fmtNum(s.exportedMt)} MT shipped</span>
                        <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-gold-500" /> {s.rating} rating</span>
                        <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> ~{s.avgResponseHrs}h response</span>
                      </div>
                    </div>
                    <WhatsAppButton
                      message={waMessages.supplier(s.name, c.name)}
                      size="sm"
                      variant="outline"
                      className="border-[#25D366]/40 text-[#128C4B] hover:bg-[#25D366]/10"
                    >
                      Chat
                    </WhatsAppButton>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* right column — sticky trade console */}
          <div className="space-y-5 lg:sticky lg:top-[136px] lg:self-start">
            <Card className="overflow-hidden">
              <div className="bg-navy-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Indicative FOB Apapa
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${up ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(c.priceChangePct).toFixed(1)}% w/w
                  </span>
                </div>
                <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
                  {fmtMoney(c.fobUsd, currency)}
                  <span className="ml-1 text-sm font-semibold text-white/50">/MT</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Trading band: {fmtMoney(c.fobLow, currency)} – {fmtMoney(c.fobHigh, currency)} /MT
                  {" · "}shown in {currency}
                </p>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MOQ</p>
                    <p className="mt-0.5 font-display text-lg font-extrabold text-navy-950">{c.moqMt} MT</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead time</p>
                    <p className="mt-0.5 font-display text-lg font-extrabold text-navy-950">14–28 days</p>
                  </div>
                </div>
                <Button variant="accent" size="lg" className="w-full" onClick={() => openRfq(c)}>
                  <FileCheck2 /> Request Formal Quotation (RFQ)
                </Button>
                <WhatsAppButton
                  message={waMessages.product(c.name, c.hsCode, c.moqMt)}
                  size="lg"
                  className="w-full"
                >
                  Direct WhatsApp Chat
                </WhatsAppButton>
                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Hague Trade Assurance: RFQs route only to badge-verified suppliers. Third-party
                  inspection available at loading (SGS / Bureau Veritas).
                </p>
              </CardContent>
            </Card>

            {primary && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Lead Supplier Verification Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vermilion-600 font-display text-xs font-extrabold text-white">
                      {primary.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-950">{primary.name}</p>
                      <p className="text-xs text-slate-500">{primary.state} State, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <VerificationBadge tier={primary.badge} size="sm" />
                    {primary.nepc && <NepcChip />}
                  </div>
                  <Separator />
                  <dl className="space-y-2.5 text-[13px]">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">CAC status</dt>
                      <dd className="font-bold text-navy-950">{primary.rcNumber} · Active</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">NEPC registration</dt>
                      <dd className={primary.nepc ? "font-bold text-emerald-600" : "font-bold text-amber-600"}>
                        {primary.nepc ? "Verified" : "Pending"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Export track record</dt>
                      <dd className="font-bold text-navy-950">{fmtNum(primary.exportedMt)} MT · {primary.yearsActive} yrs</dd>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">RFQ response rate</dt>
                        <dd className="font-bold text-navy-950">{primary.responseRate}%</dd>
                      </div>
                      <Progress value={primary.responseRate} className="mt-1.5 h-1.5" indicatorClassName="bg-emerald-500" />
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}

            <Card className="border-dashed">
              <CardContent className="flex items-start gap-3 p-4">
                <LineChart className="mt-0.5 h-5 w-5 shrink-0 text-brandblue-500" />
                <p className="text-xs leading-relaxed text-slate-500">
                  <b className="text-navy-900">Price Intelligence (Phase 2):</b> 12-month FOB history
                  and destination CIF benchmarks for this commodity will be charted here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-950">Related in {c.category}</h2>
              <Link to="/marketplace" className="text-sm font-bold text-vermilion-600 hover:text-vermilion-500">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <CommodityCard key={r.id} c={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
