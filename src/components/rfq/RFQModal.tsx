import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Minus,
  Package,
  Plus,
  Scale,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Price } from "@/components/brand/Price";
import { useUi } from "@/store/ui";
import { useTrade } from "@/store/rfq";
import { useAuth } from "@/store/auth";
import { usePrefs } from "@/store/prefs";
import { destinationCountries, destinationPorts } from "@/data/content";
import { fmtMoney } from "@/lib/format";
import { sleep as wait } from "@/lib/utils";
import { cn } from "@/lib/utils";

const timelines = ["Immediate (≤ 30 days)", "30 – 60 days", "60 – 90 days", "Flexible"];
const incoOptions = [
  { id: "FOB Apapa", label: "FOB — Lagos Apapa", hint: "Buyer arranges main freight" },
  { id: "FOB Tin Can", label: "FOB — Tin Can Island", hint: "Buyer arranges main freight" },
  { id: "CIF", label: "CIF — Destination Port", hint: "Supplier covers freight & insurance" },
  { id: "CFR", label: "CFR — Destination Port", hint: "Supplier covers freight" },
];
const inspectionOptions = ["SGS", "Bureau Veritas", "Cotecna", "Intertek", "No third-party inspection"];
const quickQty = [19, 25, 50, 100];

const steps = [
  { label: "Volume & Timeline", icon: Scale },
  { label: "Terms & Destination", icon: Anchor },
  { label: "Pricing & Inspection", icon: ClipboardCheck },
];

export function RFQModal() {
  const { rfqOpen, rfqCommodity: c, closeRfq } = useUi();
  const addRfq = useTrade((s) => s.addRfq);
  const user = useAuth((s) => s.user);
  const currency = usePrefs((s) => s.currency);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const [qty, setQty] = useState<number>(25);
  const [timeline, setTimeline] = useState(timelines[1]);
  const [incoterm, setIncoterm] = useState("CIF");
  const [country, setCountry] = useState("Germany");
  const [port, setPort] = useState("Hamburg");
  const [targetMin, setTargetMin] = useState<number>(0);
  const [targetMax, setTargetMax] = useState<number>(0);
  const [packaging, setPackaging] = useState("");
  const [inspections, setInspections] = useState<string[]>(["SGS"]);
  const [notes, setNotes] = useState("");

  const isFob = incoterm.startsWith("FOB");
  const portsForCountry = useMemo(
    () => destinationPorts.filter((p) => p.country === country),
    [country]
  );

  function reset(next?: boolean) {
    if (!next) {
      setStep(0);
      setDoneRef(null);
      setSubmitting(false);
    }
    if (c) {
      setQty(c.moqMt);
      setTargetMin(Math.round(c.fobLow));
      setTargetMax(Math.round(c.fobHigh));
      setPackaging(c.packaging[0] ?? "50kg PP bags");
    }
  }

  // Seed sensible defaults whenever the modal opens for a commodity.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (rfqOpen && c && seededFor !== c.id) {
    setSeededFor(c.id);
    reset();
  }
  if (!rfqOpen && seededFor) {
    setSeededFor(null);
  }

  const qtyOk = qty > 0;
  const priceOk = targetMin > 0 && targetMax > 0 && targetMin <= targetMax;
  const destOk = isFob || (country && port);

  async function submit() {
    if (!c) return;
    setSubmitting(true);
    await wait(1400);
    const rfq = addRfq({
      commodityId: c.id,
      commodityName: c.name,
      hsCode: c.hsCode,
      quantityMt: qty,
      timeline,
      incoterm: isFob ? incoterm : `${incoterm} ${port}`,
      destinationCountry: isFob ? "Nigeria (Load Port)" : country,
      destinationPort: isFob ? incoterm.replace("FOB ", "") : port,
      targetMinUsd: targetMin,
      targetMaxUsd: targetMax,
      packaging,
      inspections,
      notes: notes.trim() || undefined,
      buyerName: user?.name ?? "Guest Buyer",
      buyerCompany: user?.company ?? "Guest Account (Preview)",
      buyerCountry: user?.country ?? "—",
      ownerId: user?.id ?? "guest",
    });
    setSubmitting(false);
    setDoneRef(rfq.ref);
    toast.success("RFQ broadcast to verified suppliers", {
      description: `${rfq.ref} · ${qty} MT of ${c.name}. Matching suppliers notified by email + WhatsApp.`,
    });
  }

  if (!c) return null;

  return (
    <Dialog open={rfqOpen} onOpenChange={(o) => (!o ? closeRfq() : null)}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0" hideClose={false}>
        {doneRef ? (
          <SuccessView
            refNo={doneRef}
            commodity={c.name}
            qty={qty}
            onViewDashboard={() => {
              closeRfq();
              navigate("/dashboard/buyer");
            }}
            onClose={closeRfq}
          />
        ) : (
          <>
            <div className="border-b border-slate-100 bg-navy-950 px-6 py-5 text-white">
              <DialogHeader>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-vermilion-300">
                  <FileCheck2 className="h-4 w-4" /> Request Formal Quotation
                </div>
                <DialogTitle className="text-white text-xl">
                  {c.name}{" "}
                  <span className="ml-1 font-mono text-xs font-semibold text-white/50">
                    HS {c.hsCode}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-white/60 text-[13px]">
                  Indicative FOB market: <Price usd={c.fobUsd} amountClassName="text-white font-bold" suffix="/MT" /> ·
                  Your RFQ goes only to badge-verified suppliers of this commodity.
                </DialogDescription>
              </DialogHeader>

              {/* stepper */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {steps.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all",
                        i < step && "border-emerald-400 bg-emerald-400/15 text-emerald-300",
                        i === step && "border-vermilion-500 bg-vermilion-600 text-white shadow-glow",
                        i > step && "border-white/20 bg-white/5 text-white/40"
                      )}
                    >
                      {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-[11px] font-bold leading-tight",
                          i === step ? "text-white" : "text-white/50"
                        )}
                      >
                        {s.label}
                      </p>
                      <p className="text-[10px] text-white/35">Step {i + 1} of 3</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6">
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <Scale className="h-3.5 w-3.5 text-slate-400" /> Quantity required — Metric Tons (MT) *
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        aria-label="decrease"
                      >
                        <Minus />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="h-12 text-center font-display text-lg font-bold"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQty(qty + 1)}
                        aria-label="increase"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickQty.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQty(q)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs font-bold transition-colors",
                            qty === q
                              ? "border-vermilion-600 bg-vermilion-50 text-vermilion-700"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                          )}
                        >
                          {q} MT
                        </button>
                      ))}
                      <span className="ml-auto self-center text-xs text-slate-400">
                        MOQ for this listing: <b className="text-navy-900">{c.moqMt} MT</b>
                      </span>
                    </div>
                    {qty < c.moqMt && (
                      <p className="mt-2 text-xs font-medium text-amber-600">
                        Below this listing's MOQ — suppliers may still accept at a price premium.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-slate-400" /> Target delivery timeline
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timelines.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-[13px] font-semibold text-left transition-all",
                            timeline === t
                              ? "border-vermilion-600 bg-vermilion-50 text-vermilion-700 shadow-glow"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <Anchor className="h-3.5 w-3.5 text-slate-400" /> Desired Incoterm *
                    </Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {incoOptions.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setIncoterm(o.id)}
                          className={cn(
                            "rounded-xl border p-3 text-left transition-all",
                            incoterm === o.id
                              ? "border-vermilion-600 bg-vermilion-50 shadow-glow"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <p className={cn("text-[13px] font-bold", incoterm === o.id ? "text-vermilion-700" : "text-navy-900")}>
                            {o.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">{o.hint}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 transition-opacity", isFob && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label>Destination country</Label>
                      <Select
                        value={country}
                        onValueChange={(v) => {
                          setCountry(v);
                          const first = destinationPorts.find((p) => p.country === v);
                          if (first) setPort(first.port);
                        }}
                        disabled={isFob}
                      >
                        <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {destinationCountries.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination port</Label>
                      <Select value={port} onValueChange={setPort} disabled={isFob}>
                        <SelectTrigger><SelectValue placeholder="Select port" /></SelectTrigger>
                        <SelectContent>
                          {portsForCountry.map((p) => (
                            <SelectItem key={p.port} value={p.port}>{p.port}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {isFob && (
                    <p className="rounded-lg bg-navy-50 px-3 py-2 text-xs font-medium text-navy-800">
                      FOB selected — pricing will be quoted free-on-board at the Nigerian load port
                      ({incoterm.replace("FOB ", "")}). Main-carriage freight stays with you.
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2">Target price range per MT ({currency}) *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">MIN</span>
                        <Input
                          type="number"
                          value={targetMin}
                          onChange={(e) => setTargetMin(Number(e.target.value))}
                          className="pl-12 font-semibold"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">MAX</span>
                        <Input
                          type="number"
                          value={targetMax}
                          onChange={(e) => setTargetMax(Number(e.target.value))}
                          className="pl-12 font-semibold"
                        />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      Indicative FOB band for this grade: {fmtMoney(c.fobLow, currency)} – {fmtMoney(c.fobHigh, currency)} /MT
                    </p>
                    {targetMin > 0 && targetMax > 0 && targetMin > targetMax && (
                      <p className="mt-1.5 text-xs font-semibold text-red-500">
                        Minimum exceeds maximum — please adjust.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-slate-400" /> Packaging requirement
                    </Label>
                    <Select value={packaging} onValueChange={setPackaging}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[...c.packaging, "Supplier standard"].map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Cargo inspection specification
                    </Label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {inspectionOptions.map((o) => (
                        <label
                          key={o}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-all",
                            inspections.includes(o)
                              ? "border-vermilion-600 bg-vermilion-50 text-vermilion-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          <Checkbox
                            checked={inspections.includes(o)}
                            onCheckedChange={(checked) =>
                              setInspections((prev) =>
                                checked
                                  ? [...prev.filter((x) => x !== "No third-party inspection" || o === "No third-party inspection"), o]
                                  : prev.filter((x) => x !== o)
                              )
                            }
                          />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional notes to suppliers (optional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. LC at sight preferred; phytosanitary + COA required per lot; penalty for late shipment."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <div className="text-xs text-slate-400 hidden sm:block">
                {step === 0 && `${qty} MT · ${timeline}`}
                {step === 1 && (isFob ? incoterm : `${incoterm} ${port}, ${country}`)}
                {step === 2 && priceOk && `Target ${fmtMoney(targetMin, currency, { compact: true })}–${fmtMoney(targetMax, currency, { compact: true })}/MT`}
              </div>
              <div className="flex gap-2 ml-auto">
                {step > 0 && (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    <ArrowLeft /> Back
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    variant="accent"
                    onClick={() => setStep(step + 1)}
                    disabled={(step === 0 && !qtyOk) || (step === 1 && !destOk)}
                  >
                    Continue <ArrowRight />
                  </Button>
                ) : (
                  <Button variant="accent" size="lg" disabled={!priceOk} isLoading={submitting} onClick={submit}>
                    {submitting ? "Broadcasting RFQ…" : "Submit RFQ to Suppliers"}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessView({
  refNo,
  commodity,
  qty,
  onViewDashboard,
  onClose,
}: {
  refNo: string;
  commodity: string;
  qty: number;
  onViewDashboard: () => void;
  onClose: () => void;
}) {
  return (
    <div className="px-8 py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
        <CheckCircle2 className="h-9 w-9 text-emerald-500" strokeWidth={2.25} />
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-navy-950">RFQ Submitted Successfully</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Your request for <b className="text-navy-900">{qty} MT of {commodity}</b> has been broadcast to
        badge-verified suppliers. Expect first quotes within <b className="text-navy-900">4–24 hours</b>;
        you'll also be notified by email and WhatsApp.
      </p>
      <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
        <Badge variant="accent">SUBMITTED</Badge>
        <span className="font-mono text-sm font-bold tracking-wide text-navy-950">{refNo}</span>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="accent" size="lg" onClick={onViewDashboard}>
          View RFQ in Buyer Dashboard <ArrowRight />
        </Button>
        <Button variant="outline" size="lg" onClick={onClose}>
          Continue Browsing
        </Button>
      </div>
    </div>
  );
}
