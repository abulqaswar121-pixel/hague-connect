import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { RFQ } from "@/types";
import { useTrade } from "@/store/rfq";
import { useAuth } from "@/store/auth";
import { fmtMoney } from "@/lib/format";
import { sleep } from "@/lib/utils";

interface Props {
  rfq: RFQ | null;
  onClose: () => void;
}

export function QuoteComposer({ rfq, onClose }: Props) {
  const addQuote = useTrade((s) => s.addQuote);
  const user = useAuth((s) => s.user);
  const [price, setPrice] = useState<number>(0);
  const [incoterm, setIncoterm] = useState("");
  const [lead, setLead] = useState(21);
  const [valid, setValid] = useState(14);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  // re-seed defaults when a new RFQ opens
  const [seeded, setSeeded] = useState<string | null>(null);
  if (rfq && seeded !== rfq.id) {
    setSeeded(rfq.id);
    setPrice(Math.round((rfq.targetMinUsd + rfq.targetMaxUsd) / 2));
    setIncoterm(rfq.incoterm.startsWith("FOB") ? rfq.incoterm : `${rfq.incoterm.split(" ")[0]} ${rfq.destinationPort}`);
    setLead(21);
    setValid(14);
    setNotes("");
  }
  if (!rfq && seeded) setSeeded(null);

  async function submit() {
    if (!rfq) return;
    setSending(true);
    await sleep(1200);
    const q = addQuote({
      rfqId: rfq.id,
      supplierName: user?.company ?? "Your Company Ltd",
      badge: user?.verification ?? "gold",
      priceUsd: price,
      incoterm,
      leadTimeDays: lead,
      validDays: valid,
      notes: notes.trim() || undefined,
    });
    setSending(false);
    onClose();
    toast.success(`Quote ${q.ref} sent to ${rfq.buyerCompany}`, {
      description: `${fmtMoney(price, "USD")}/MT · ${incoterm} · valid ${valid} days. Buyer notified instantly.`,
    });
  }

  if (!rfq) return null;

  return (
    <Dialog open={!!rfq} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Send Quote
            <Badge variant="accent-soft" className="font-mono">{rfq.ref}</Badge>
          </DialogTitle>
          <DialogDescription>
            {rfq.quantityMt} MT of {rfq.commodityName} → {rfq.destinationPort},{" "}
            {rfq.destinationCountry} · buyer target {fmtMoney(rfq.targetMinUsd, "USD")}–
            {fmtMoney(rfq.targetMaxUsd, "USD")}/MT
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Unit price — USD per MT *</Label>
            <Input
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="font-display text-base font-bold"
              placeholder="e.g. 1650"
            />
            {price > 0 && (
              <p className="text-xs text-slate-400">
                Contract value ≈ <b className="text-navy-900">{fmtMoney(price * rfq.quantityMt, "USD")}</b>
                {(price < rfq.targetMinUsd || price > rfq.targetMaxUsd) && (
                  <span className="ml-1 font-semibold text-amber-600">— outside buyer band</span>
                )}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Incoterm basis</Label>
            <Select value={incoterm} onValueChange={setIncoterm}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["FOB Apapa", "FOB Tin Can", `CIF ${rfq.destinationPort}`, `CFR ${rfq.destinationPort}`].map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Lead time (days)</Label>
            <Input type="number" value={lead} onChange={(e) => setLead(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Quote validity (days)</Label>
            <Input type="number" value={valid} onChange={(e) => setValid(Number(e.target.value))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Terms & notes to buyer</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 30% advance / 70% against BL copy; SGS at loading on seller account; penalty 1%/week for late shipment."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="accent" disabled={price <= 0} isLoading={sending} onClick={submit}>
            <Send /> {sending ? "Transmitting…" : "Send Quote to Buyer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
