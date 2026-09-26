import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileBadge,
  FileCheck2,
  PlusCircle,
  Quote as QuoteIcon,
  Send,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatCard, Trend } from "@/components/dashboard/StatCard";
import { RfqStatusBadge } from "@/components/brand/StatusBadge";
import { VerificationBadge } from "@/components/brand/VerificationBadge";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { QuoteComposer } from "@/components/modals/QuoteComposer";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { useAuth } from "@/store/auth";
import { useTrade } from "@/store/rfq";
import { useAllCommodities, useListings } from "@/store/listings";
import { commodities as baseCommodities } from "@/data/commodities";
import { suppliers } from "@/data/suppliers";
import { tierRank, verificationTiers } from "@/data/content";
import { fmtDate, fmtMoney, fmtNum, timeAgo } from "@/lib/format";
import { waMessages } from "@/lib/whatsapp";
import type { RFQ } from "@/types";
import { cn } from "@/lib/utils";

export function ExporterDashboard() {
  const user = useAuth((s) => s.user)!;
  const setVerification = useAuth((s) => s.setVerification);
  const { rfqs, quotes, quoteCount } = useTrade();
  const removeListing = useListings((s) => s.removeListing);
  const all = useAllCommodities();

  const [composerFor, setComposerFor] = useState<RFQ | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const mySupplier = suppliers.find((s) => s.name === user.company);
  const myQuotes = quotes.filter((q) => q.supplierName === user.company);
  const activeInquiries = rfqs.filter((r) => r.status !== "closed");

  const myProducts = useMemo(() => {
    const base = mySupplier
      ? baseCommodities.filter((c) => c.supplierIds.includes(mySupplier.id))
      : [];
    const custom = all.filter((c) => c.isCustom);
    return [...custom, ...base];
  }, [all, mySupplier]);

  const rank = tierRank[user.verification];
  const currentTierIdx = rank - 1;

  const quotedRfqIds = new Set(myQuotes.map((q) => q.rfqId));

  function verificationAction() {
    if (user.verification === "bronze") {
      toast.success("Documents received", {
        description: "CAC + NEPC documents queued for review — Silver badge activated in preview mode.",
      });
      setVerification("silver");
    } else if (user.verification === "silver") {
      toast.success("Site inspection booked", {
        description: "A Hague field officer will visit your facility within 5 working days. Gold activated in preview.",
      });
      setVerification("gold");
    } else if (user.verification === "gold") {
      toast.success("Platinum audit initiated", {
        description: "Compliance audit scheduled with third-party surveyor. Platinum activated in preview.",
      });
      setVerification("platinum");
    } else {
      toast.info("You hold the highest tier", {
        description: "Platinum status renews via annual compliance re-audit.",
      });
    }
  }

  return (
    <div className="bg-slate-50">
      {/* workspace header */}
      <section className="border-b border-white/10 bg-navy-950 text-white">
        <div className="container py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-vermilion-300">
                Exporter Command Center
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {user.company}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <VerificationBadge tier={user.verification} size="sm" />
                <Badge variant="gold">{user.tier} plan</Badge>
                {user.rcNumber && (
                  <Badge variant="outline" className="border-white/20 bg-transparent text-white/60 font-mono">
                    {user.rcNumber}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <WhatsAppButton message={waMessages.exporter(user.company)} variant="outline-light" size="sm">
                Trade Desk
              </WhatsAppButton>
              <Button variant="accent" size="sm" onClick={() => setAddOpen(true)}>
                <PlusCircle /> Add Commodity
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={ClipboardList} label="Active Inquiries" value={activeInquiries.length} sub={<Trend>Global feed</Trend>} tone="accent" />
          <StatCard icon={Send} label="Sent Quotes" value={myQuotes.length} sub={<Trend>{fmtNum(myQuotes.length * 3)} views</Trend>} tone="navy" />
          <StatCard icon={Eye} label="Profile Views" value={fmtNum(user.profileViews ?? 1284)} sub={<Trend>12% w/w</Trend>} tone="blue" />
          <StatCard icon={BadgeCheck} label="Current Tier" value={user.tier} tone="gold" />
          <StatCard icon={ShieldCheck} label="Verification" value={<span className="capitalize">{user.verification}</span>} tone="emerald" />
        </div>

        <Tabs defaultValue="rfqs" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="rfqs">
              Incoming RFQs
              <Badge variant="accent" className="ml-1 px-1.5">{activeInquiries.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="products">My Listed Products ({myProducts.length})</TabsTrigger>
            <TabsTrigger value="quotes">Sent Quotes ({myQuotes.length})</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
          </TabsList>

          {/* ------------------------- INCOMING RFQS ------------------------- */}
          <TabsContent value="rfqs">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Global Buyer RFQ Feed</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    Structured demand from buyers in {new Set(rfqs.map((r) => r.buyerCountry)).size} countries — quote early to win the lane.
                  </p>
                </div>
                <Badge variant="gold-soft">Updated {timeAgo(Math.max(...rfqs.map((r) => r.createdAt)))}</Badge>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>RFQ</TableHead>
                      <TableHead>Commodity</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Target band</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqs.map((r) => {
                      const quoted = quotedRfqIds.has(r.id);
                      return (
                        <TableRow key={r.id}>
                          <TableCell>
                            <span className="font-mono text-xs font-bold text-navy-950">{r.ref}</span>
                            <span className="block text-[11px] text-slate-400">{timeAgo(r.createdAt)}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-navy-950">{r.commodityName}</span>
                            <span className="block font-mono text-[11px] text-slate-400">HS {r.hsCode}</span>
                          </TableCell>
                          <TableCell className="text-right font-bold tabular-nums">{r.quantityMt} MT</TableCell>
                          <TableCell>
                            <span className="font-semibold">{r.buyerCompany}</span>
                            <span className="block text-[11px] text-slate-400">{r.buyerCountry}</span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs font-semibold tabular-nums">
                            {fmtMoney(r.targetMinUsd, "USD")}–{fmtMoney(r.targetMaxUsd, "USD")}
                          </TableCell>
                          <TableCell className="text-xs">{r.timeline}</TableCell>
                          <TableCell>
                            <RfqStatusBadge status={r.status} quoteCount={quoteCount(r.id)} />
                          </TableCell>
                          <TableCell className="text-right">
                            {quoted ? (
                              <Badge variant="success-soft" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Quoted
                              </Badge>
                            ) : (
                              <Button size="sm" variant="accent" onClick={() => setComposerFor(r)}>
                                <Send className="h-3.5 w-3.5" /> Send Quote
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----------------------------- PRODUCTS ---------------------------- */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>My Listed Products</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    Live storefront inventory — changes reflect instantly in the public marketplace.
                  </p>
                </div>
                <Button variant="accent" size="sm" onClick={() => setAddOpen(true)}>
                  <PlusCircle /> Add New Commodity
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {myProducts.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <FileCheck2 className="h-9 w-9 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-navy-950">No products listed yet</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                      Publish your first commodity to appear in buyer search results.
                    </p>
                    <Button variant="accent" size="sm" className="mt-4" onClick={() => setAddOpen(true)}>
                      <PlusCircle /> Add New Commodity
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">MOQ</TableHead>
                        <TableHead className="text-right">FOB $/MT</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myProducts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <Link to={`/product/${p.slug}`} className="font-semibold text-navy-950 hover:text-vermilion-600">
                              {p.name}
                            </Link>
                            <span className="block text-[11px] text-slate-400">{p.grade}</span>
                          </TableCell>
                          <TableCell className="text-xs">{p.category}</TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">{p.moqMt} MT</TableCell>
                          <TableCell className="text-right font-bold tabular-nums">{fmtMoney(p.fobUsd, "USD")}</TableCell>
                          <TableCell className="text-xs">{p.origin.join(", ")}</TableCell>
                          <TableCell>
                            {p.isCustom ? (
                              <Badge variant="warning">Pending verification</Badge>
                            ) : (
                              <Badge variant="success-soft">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Link to={`/product/${p.slug}`}>
                                <Button size="sm" variant="ghost">View</Button>
                              </Link>
                              {p.isCustom && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => {
                                    removeListing(p.id);
                                    toast.success("Listing removed", { description: `${p.name} is no longer visible to buyers.` });
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------------------ QUOTES ----------------------------- */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Sent Quotes</CardTitle>
                <p className="mt-1 text-xs text-slate-500">Track every commercial offer you've transmitted to buyers.</p>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {myQuotes.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <QuoteIcon className="h-9 w-9 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-navy-950">No quotes sent yet</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                      Open the Incoming RFQs tab and respond to live buyer demand.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Quote</TableHead>
                        <TableHead>RFQ</TableHead>
                        <TableHead className="text-right">Price /MT</TableHead>
                        <TableHead>Terms</TableHead>
                        <TableHead>Lead time</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myQuotes.map((q) => {
                        const rfq = rfqs.find((r) => r.id === q.rfqId);
                        return (
                          <TableRow key={q.id}>
                            <TableCell className="font-mono text-xs font-bold">{q.ref}</TableCell>
                            <TableCell className="text-xs">
                              {rfq?.ref} · {rfq?.commodityName}
                            </TableCell>
                            <TableCell className="text-right font-bold tabular-nums">
                              {fmtMoney(q.priceUsd, "USD")}
                            </TableCell>
                            <TableCell className="text-xs">{q.incoterm}</TableCell>
                            <TableCell className="text-xs">{q.leadTimeDays} days</TableCell>
                            <TableCell className="text-xs">{q.validDays} days</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  q.status === "accepted"
                                    ? "success-soft"
                                    : q.status === "declined"
                                    ? "danger"
                                    : "info"
                                }
                              >
                                {q.status === "accepted" ? "Accepted" : q.status === "declined" ? "Declined" : "With buyer"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --------------------------- VERIFICATION --------------------------- */}
          <TabsContent value="verification">
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Journey</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    Each tier unlocks more buyer trust, better placement and bigger tickets.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Tier {rank} of 4 — {verificationTiers[currentTierIdx].name}</span>
                    <span>{Math.round((rank / 4) * 100)}% complete</span>
                  </div>
                  <Progress value={(rank / 4) * 100} className="h-2.5" />
                  <div className="mt-6 space-y-3">
                    {verificationTiers.map((t, i) => {
                      const done = i < rank;
                      const current = i === currentTierIdx;
                      return (
                        <div
                          key={t.id}
                          className={cn(
                            "flex items-start gap-3.5 rounded-xl border p-4 transition-colors",
                            current ? "border-vermilion-500/60 bg-vermilion-50/50" : done ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 opacity-70"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold",
                              done ? "bg-emerald-500 text-white" : current ? "bg-vermilion-600 text-white" : "bg-slate-200 text-slate-500"
                            )}
                          >
                            {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-navy-950">
                                {t.name} — {t.tagline}
                              </p>
                              {current && <Badge variant="accent">Current</Badge>}
                              {done && i < currentTierIdx && <Badge variant="success-soft">Completed</Badge>}
                            </div>
                            <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                              {t.requirements.slice(0, 4).map((r) => (
                                <li key={r} className="flex items-start gap-1.5 text-[11.5px] text-slate-500">
                                  <CheckCircle2 className={cn("mt-0.5 h-3 w-3 shrink-0", done || current ? "text-emerald-500" : "text-slate-300")} />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Completed checks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {[
                      ["Identity & contact verification", true],
                      ["CAC certificate of incorporation", rank >= 2],
                      ["NEPC exporter license", rank >= 2],
                      ["Physical site inspection", rank >= 3],
                      ["International trade certification", rank >= 4],
                    ].map(([label, ok]) => (
                      <div key={label as string} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                        <span className="text-[13px] font-medium text-slate-600">{label as string}</span>
                        {ok ? (
                          <Badge variant="success-soft" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Done</Badge>
                        ) : (
                          <Badge variant="muted">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-vermilion-500/30 bg-gradient-to-b from-vermilion-50/60 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <FileBadge className="h-5 w-5 text-vermilion-600" />
                      <p className="text-sm font-bold text-navy-950">
                        {rank >= 4 ? "Maintain Platinum standing" : `Next: ${verificationTiers[Math.min(rank, 3)].name} tier`}
                      </p>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600">
                      {rank >= 4
                        ? "Keep your dispute record clean and documents current to retain first-access to enterprise tenders."
                        : verificationTiers[Math.min(rank, 3)].requirements[0] + " — complete the remaining requirements to upgrade."}
                    </p>
                    <Button variant="accent" className="mt-4 w-full" onClick={verificationAction}>
                      <UploadCloud />
                      {user.verification === "bronze" && "Upload CAC & NEPC Documents"}
                      {user.verification === "silver" && "Book Site Inspection"}
                      {user.verification === "gold" && "Start Platinum Audit"}
                      {user.verification === "platinum" && "View Standing"}
                    </Button>
                    <p className="mt-2 text-center text-[11px] text-slate-400">
                      Included free with {user.tier === "Free" ? "paid plans" : `your ${user.tier} plan`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <QuoteComposer rfq={composerFor} onClose={() => setComposerFor(null)} />
      <AddProductModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
