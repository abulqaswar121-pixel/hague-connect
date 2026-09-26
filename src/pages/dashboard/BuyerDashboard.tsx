import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Handshake,
  Package2,
  PlusCircle,
  Quote as QuoteIcon,
  Scale,
  Star,
  Timer,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/misc";
import { StatCard, Trend } from "@/components/dashboard/StatCard";
import { RfqStatusBadge } from "@/components/brand/StatusBadge";
import { VerificationBadge } from "@/components/brand/VerificationBadge";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { useAuth } from "@/store/auth";
import { useTrade } from "@/store/rfq";
import { useAllCommodities } from "@/store/listings";
import { useUi } from "@/store/ui";
import { fmtDate, fmtMoney, fmtNum, timeAgo } from "@/lib/format";
import { waMessages } from "@/lib/whatsapp";
import type { Commodity, Quote, RFQ } from "@/types";
import { cn } from "@/lib/utils";

export function BuyerDashboard() {
  const user = useAuth((s) => s.user)!;
  const { rfqs, quotes, quotesForRfq, quoteCount, setQuoteStatus, setRfqStatus } = useTrade();
  const all = useAllCommodities();
  const openRfq = useUi((s) => s.openRfq);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [drawerRfq, setDrawerRfq] = useState<RFQ | null>(null);

  const myRfqs = useMemo(
    () =>
      rfqs
        .filter((r) => r.ownerId === user.id)
        .sort((a, b) => b.createdAt - a.createdAt),
    [rfqs, user.id]
  );
  const myRfqIds = new Set(myRfqs.map((r) => r.id));
  const myQuotes = quotes.filter((q) => myRfqIds.has(q.rfqId));
  const discussion = myQuotes.filter((q) => q.status === "accepted").length +
    myRfqs.filter((r) => r.status === "in_discussion").length;

  function accept(q: Quote) {
    setQuoteStatus(q.id, "accepted");
    setRfqStatus(q.rfqId, "in_discussion");
    toast.success(`Quote ${q.ref} accepted`, {
      description: `${q.supplierName} notified. Hague contracts desk will draft the proforma invoice within 24h.`,
    });
  }

  function decline(q: Quote) {
    setQuoteStatus(q.id, "declined");
    toast(`Quote ${q.ref} declined`, {
      description: `${q.supplierName} has been politely notified.`,
    });
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-white/10 bg-navy-950 text-white">
        <div className="container py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-vermilion-300">
                Buyer Command Center
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {user.company}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="gold">{user.tier} plan</Badge>
                <Badge variant="outline" className="border-white/20 bg-transparent text-white/60">
                  {user.country}
                </Badge>
              </div>
            </div>
            <Button variant="accent" onClick={() => setPickerOpen(true)}>
              <PlusCircle /> New RFQ
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={ClipboardList}
            label="Active RFQs"
            value={myRfqs.filter((r) => r.status !== "closed").length}
            sub={<Trend>{myRfqs.length} total</Trend>}
            tone="accent"
          />
          <StatCard
            icon={QuoteIcon}
            label="Quotes Received"
            value={myQuotes.length}
            sub={<Trend>{myQuotes.filter((q) => q.status === "pending").length} pending review</Trend>}
            tone="blue"
          />
          <StatCard
            icon={Handshake}
            label="Contracts in Discussion"
            value={discussion}
            sub={<Trend>Contracts desk active</Trend>}
            tone="emerald"
          />
        </div>

        <Card className="mt-8">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>My RFQs</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Every RFQ you broadcast — including the one you just submitted — is tracked here in real time.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <PlusCircle /> New RFQ
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {myRfqs.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <FileCheck2 className="h-9 w-9 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-navy-950">No RFQs yet</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Submit your first Request for Quotation — verified suppliers typically respond within 4–24 hours.
                </p>
                <Button variant="accent" size="sm" className="mt-4" onClick={() => setPickerOpen(true)}>
                  <PlusCircle /> Start your first RFQ
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>RFQ</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Target band</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRfqs.map((r) => {
                    const count = quoteCount(r.id);
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <span className="font-mono text-xs font-bold text-navy-950">{r.ref}</span>
                          <span className="block text-[11px] text-slate-400">{fmtDate(r.createdAt)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-navy-950">{r.commodityName}</span>
                          <span className="block font-mono text-[11px] text-slate-400">HS {r.hsCode}</span>
                        </TableCell>
                        <TableCell className="text-right font-bold tabular-nums">{fmtNum(r.quantityMt)} MT</TableCell>
                        <TableCell className="text-xs">
                          {r.destinationPort}
                          <span className="block text-[11px] text-slate-400">{r.destinationCountry}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs font-semibold tabular-nums">
                          {fmtMoney(r.targetMinUsd, "USD")}–{fmtMoney(r.targetMaxUsd, "USD")}
                        </TableCell>
                        <TableCell>
                          <RfqStatusBadge status={r.status} quoteCount={count} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant={count ? "accent" : "outline"}
                              onClick={() => count && setDrawerRfq(r)}
                              disabled={!count}
                            >
                              <Scale className="h-3.5 w-3.5" />
                              {count ? `Compare ${count} Quote${count > 1 ? "s" : ""}` : "No quotes yet"}
                            </Button>
                            <WhatsAppButton
                              message={waMessages.rfq(r.ref, r.commodityName, r.quantityMt)}
                              size="sm"
                              variant="outline"
                              className="border-[#25D366]/40 px-2.5 text-[#128C4B] hover:bg-[#25D366]/10"
                              aria-label="Follow up on WhatsApp"
                            >
                              <span className="sr-only">WhatsApp</span>
                            </WhatsAppButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* new RFQ commodity picker */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start a new RFQ</DialogTitle>
            <DialogDescription>
              Pick the commodity line you want to source — the RFQ wizard opens next.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            {all.slice(0, 12).map((c: Commodity) => (
              <button
                key={c.id}
                onClick={() => {
                  setPickerOpen(false);
                  openRfq(c);
                }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all hover:border-vermilion-500/50 hover:shadow-card"
              >
                {c.image ? (
                  <img src={c.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-950 text-white">
                    <Package2 className="h-4 w-4" />
                  </span>
                )}
                <span>
                  <span className="block text-[13px] font-bold text-navy-950">{c.name}</span>
                  <span className="block text-[11px] text-slate-400">
                    {c.category} · MOQ {c.moqMt} MT
                  </span>
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* quotes comparison drawer */}
      <Sheet open={!!drawerRfq} onOpenChange={(o) => (!o ? setDrawerRfq(null) : null)}>
        <SheetContent className="sm:max-w-2xl p-0">
          {drawerRfq && (
            <QuotesDrawer
              rfq={drawerRfq}
              quotes={quotesForRfq(drawerRfq.id)}
              onAccept={accept}
              onDecline={decline}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function QuotesDrawer({
  rfq,
  quotes,
  onAccept,
  onDecline,
}: {
  rfq: RFQ;
  quotes: Quote[];
  onAccept: (q: Quote) => void;
  onDecline: (q: Quote) => void;
}) {
  const best = quotes.filter((q) => q.status !== "declined")[0];
  const accepted = quotes.find((q) => q.status === "accepted");
  const spread =
    quotes.length > 1 ? quotes[quotes.length - 1].priceUsd - quotes[0].priceUsd : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 bg-navy-950 p-6 text-white">
        <SheetHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-vermilion-300">
            Received Quotes · Comparison
          </p>
          <SheetTitle className="text-white">{rfq.commodityName}</SheetTitle>
          <SheetDescription className="font-mono text-xs text-white/50">{rfq.ref}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/[.07] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Volume</p>
            <p className="mt-0.5 font-display text-lg font-extrabold">{rfq.quantityMt} MT</p>
          </div>
          <div className="rounded-xl bg-white/[.07] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Your target</p>
            <p className="mt-0.5 font-display text-lg font-extrabold">
              ${fmtNum(rfq.targetMinUsd)}–{fmtNum(rfq.targetMaxUsd)}
            </p>
          </div>
          <div className="rounded-xl bg-white/[.07] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Quotes</p>
            <p className="mt-0.5 font-display text-lg font-extrabold">{quotes.length}</p>
          </div>
        </div>
        {spread > 0 && (
          <p className="mt-3 text-[11px] text-white/55">
            Bid spread: <b className="text-white">${fmtNum(spread)}/MT</b> between highest and lowest —
            worth ≈ <b className="text-emerald-300">{fmtMoney(spread * rfq.quantityMt, "USD")}</b> on total contract value.
          </p>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {accepted && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> You accepted {accepted.ref} from {accepted.supplierName}. The contracts desk is preparing your proforma invoice.
          </div>
        )}
        {quotes.map((q, i) => {
          const isBest = best && q.id === best.id && !accepted;
          const declined = q.status === "declined";
          const isAccepted = q.status === "accepted";
          return (
            <div
              key={q.id}
              className={cn(
                "rounded-2xl border bg-white p-5 transition-all",
                isAccepted && "border-emerald-400 ring-1 ring-emerald-300",
                isBest && "border-gold-400 ring-1 ring-gold-300",
                declined && "opacity-55"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-navy-950">{q.supplierName}</p>
                <VerificationBadge tier={q.badge} size="sm" />
                {isBest && <Badge variant="gold" className="gap-1"><Star className="h-3 w-3" /> Best price</Badge>}
                {isAccepted && <Badge variant="success" className="gap-1"><BadgeCheck className="h-3 w-3" /> Accepted</Badge>}
                {declined && <Badge variant="muted">Declined</Badge>}
                <span className="ml-auto font-mono text-[11px] font-bold text-slate-400">{q.ref}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-display text-3xl font-extrabold tracking-tight text-navy-950">
                    {fmtMoney(q.priceUsd, "USD")}
                    <span className="ml-1 text-sm font-semibold text-slate-400">/MT</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    ≈ {fmtMoney(q.priceUsd * rfq.quantityMt, "USD")} total · {q.incoterm}
                  </p>
                </div>
                <div className="flex gap-4 text-right text-xs text-slate-500">
                  <span>
                    <Timer className="mb-0.5 ml-auto h-3.5 w-3.5 text-slate-400" />
                    {q.leadTimeDays}d lead
                  </span>
                  <span>
                    <FileCheck2 className="mb-0.5 ml-auto h-3.5 w-3.5 text-slate-400" />
                    valid {q.validDays}d
                  </span>
                </div>
              </div>

              {q.notes && (
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
                  "{q.notes}"
                </p>
              )}

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="accent"
                  disabled={declined || isAccepted || !!accepted}
                  onClick={() => onAccept(q)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Accept Quote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={declined || isAccepted || !!accepted}
                  onClick={() => onDecline(q)}
                >
                  <XCircle className="h-3.5 w-3.5" /> Decline
                </Button>
                <WhatsAppButton
                  message={waMessages.quote(q.supplierName, q.ref, rfq.commodityName)}
                  size="sm"
                  variant="outline"
                  className="ml-auto border-[#25D366]/40 text-[#128C4B] hover:bg-[#25D366]/10"
                >
                  Chat on WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          );
        })}
        <p className="pb-4 text-center text-[11px] text-slate-400">
          Quotes sorted by price. Accepting a quote locks the lane and starts contract drafting with
          Hague's trade desk.
        </p>
      </div>
    </div>
  );
}
