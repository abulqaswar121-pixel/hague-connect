import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
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
import { useListings } from "@/store/listings";
import { categories, originStates } from "@/data/commodities";
import { sleep } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const packagingOptions = ["50kg PP bags", "25kg PP bags", "80kg jute bags", "Jumbo bags (1MT)", "Bulk containers"];

export function AddProductModal({ open, onOpenChange }: Props) {
  const addListing = useListings((s) => s.addListing);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [grade, setGrade] = useState("Grade A");
  const [origin, setOrigin] = useState("Kano");
  const [moq, setMoq] = useState(25);
  const [price, setPrice] = useState(0);
  const [packaging, setPackaging] = useState(packagingOptions[0]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const valid = name.trim().length >= 3 && price > 0 && moq > 0;

  async function submit() {
    setSaving(true);
    await sleep(1000);
    addListing({
      name: name.trim(),
      category,
      grade,
      origin: [origin],
      moqMt: moq,
      fobUsd: price,
      packaging: [packaging],
      description:
        description.trim() ||
        `${grade} ${name.trim()} from ${origin} State, Nigeria. Export-ready stock offered FOB Lagos Apapa. Full specification sheet available on RFQ.`,
    });
    setSaving(false);
    onOpenChange(false);
    setName("");
    setPrice(0);
    setDescription("");
    toast.success("Commodity listed on the marketplace", {
      description: "Your listing is live now with a 'Verification in progress' flag while documents are reviewed.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-vermilion-600" /> Add New Commodity
          </DialogTitle>
          <DialogDescription>
            Listing publishes instantly to your storefront and the public marketplace (Phase 1 preview).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Commodity name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tiger Nuts (Dried, Premium)" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quality grade</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Grade A", "Premium / Sortex", "Grade B", "Industrial grade", "Food grade — Non-GMO"].map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Origin state</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {originStates.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Packaging</Label>
            <Select value={packaging} onValueChange={setPackaging}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {packagingOptions.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>MOQ (MT)</Label>
            <Input type="number" value={moq} onChange={(e) => setMoq(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>FOB price — USD/MT *</Label>
            <Input type="number" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} placeholder="e.g. 1200" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Product brief (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specs, processing method, inspection options…"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="accent" disabled={!valid} isLoading={saving} onClick={submit}>
            {saving ? "Publishing…" : "Publish Listing"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
