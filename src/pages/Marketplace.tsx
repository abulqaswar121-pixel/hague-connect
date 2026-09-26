import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  FilterX,
  PackageSearch,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/misc";
import { CommodityCard, topSupplierFor } from "@/components/CommodityCard";
import { useAllCommodities } from "@/store/listings";
import { categories, originStates } from "@/data/commodities";
import { tierRank, verificationTiers } from "@/data/content";
import { cn } from "@/lib/utils";

const gradeOptions = ["Grade A", "Main crop", "Industrial", "Food grade", "RCN"];
const incoOptions = ["FOB", "CIF", "CFR"];
const packOptions = ["50kg PP bags", "Jute bags", "Jumbo bags (1MT)", "Bulk containers"];

type SortKey = "relevance" | "price_asc" | "price_desc" | "moq_asc";

export function Marketplace() {
  const [params, setParams] = useSearchParams();
  const all = useAllCommodities();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [cats, setCats] = useState<string[]>(
    params.get("category") ? [params.get("category")!] : []
  );
  const [states, setStates] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [incos, setIncos] = useState<string[]>([]);
  const [packs, setPacks] = useState<string[]>([]);
  const [minBadge, setMinBadge] = useState(0); // 0 any, 1..4
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);

  const destPort = params.get("port");

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let list = [...all];
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.category.toLowerCase().includes(needle) ||
          c.origin.join(" ").toLowerCase().includes(needle) ||
          c.hsCode.includes(needle)
      );
    }
    if (cats.length) list = list.filter((c) => cats.includes(c.category));
    if (states.length)
      list = list.filter((c) => c.origin.some((o) => states.some((s) => o.includes(s))));
    if (grades.length)
      list = list.filter((c) => grades.some((g) => c.grade.toLowerCase().includes(g.toLowerCase())));
    if (incos.length)
      list = list.filter((c) => c.incoterms.some((i) => incos.includes(i)));
    if (packs.length)
      list = list.filter((c) =>
        packs.some((p) => c.packaging.join(" ").toLowerCase().includes(p.toLowerCase().split(" ")[0]))
      );
    if (minBadge > 0)
      list = list.filter((c) => {
        const top = topSupplierFor(c);
        return top ? tierRank[top.badge] >= minBadge : false;
      });

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.fobUsd - b.fobUsd);
        break;
      case "price_desc":
        list.sort((a, b) => b.fobUsd - a.fobUsd);
        break;
      case "moq_asc":
        list.sort((a, b) => a.moqMt - b.moqMt);
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [all, q, cats, states, grades, incos, packs, minBadge, sort]);

  const activeFilterCount =
    cats.length + states.length + grades.length + incos.length + packs.length + (minBadge > 0 ? 1 : 0);

  function clearAll() {
    setCats([]);
    setStates([]);
    setGrades([]);
    setIncos([]);
    setPacks([]);
    setMinBadge(0);
    setQ("");
    setParams({});
  }

  const Filters = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <Checkbox checked={cats.includes(c)} onCheckedChange={() => toggle(cats, c, setCats)} />
              {c}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Origin state
        </h4>
        <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {originStates.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
              <Checkbox checked={states.includes(s)} onCheckedChange={() => toggle(states, s, setStates)} />
              {s}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Quality grade
        </h4>
        <div className="space-y-2">
          {gradeOptions.map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <Checkbox checked={grades.includes(g)} onCheckedChange={() => toggle(grades, g, setGrades)} />
              {g}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Incoterms
        </h4>
        <div className="flex gap-2">
          {incoOptions.map((i) => (
            <button
              key={i}
              onClick={() => toggle(incos, i, setIncos)}
              className={cn(
                "flex-1 rounded-lg border py-1.5 text-xs font-bold transition-colors",
                incos.includes(i)
                  ? "border-vermilion-600 bg-vermilion-50 text-vermilion-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Packaging
        </h4>
        <div className="space-y-2">
          {packOptions.map((p) => (
            <label key={p} className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <Checkbox checked={packs.includes(p)} onCheckedChange={() => toggle(packs, p, setPacks)} />
              {p}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Minimum supplier badge
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {verificationTiers.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setMinBadge(minBadge === i + 1 ? 0 : i + 1)}
              className={cn(
                "rounded-lg border py-2 text-[11px] font-bold transition-colors",
                minBadge === i + 1
                  ? "border-navy-950 bg-navy-950 text-white"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              )}
            >
              {t.name}+
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          {minBadge === 0
            ? "Showing all verification levels."
            : `Only suppliers at ${verificationTiers[minBadge - 1].name} tier or above.`}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      {/* page head */}
      <section className="border-b border-white/10 bg-navy-950 text-white">
        <div className="container py-10">
          <span className="kicker-dark">Global marketplace</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Verified Nigerian Commodities
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Every listing is tied to a badge-verified exporter with documented capacity,
            export history and inspection-ready stock at Lagos Apapa or Tin Can Island.
          </p>
          {destPort && (
            <Badge variant="gold" className="mt-4">
              Routing to {destPort} — CIF-capable suppliers prioritised
            </Badge>
          )}
        </div>
      </section>

      <div className="container py-8">
        {/* toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-vermilion-500/40">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by commodity, state or HS code…"
              className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
            />
          </label>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort: Relevance</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="moq_asc">MOQ: Low → High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal /> Filters
                {activeFilterCount > 0 && <Badge variant="accent">{activeFilterCount}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-6">
              <h3 className="mb-5 font-display text-lg font-bold text-navy-950">Refine results</h3>
              {Filters}
              <Button className="mt-6 w-full" variant="accent" onClick={() => setMobileFilters(false)}>
                Show {filtered.length} results
              </Button>
            </SheetContent>
          </Sheet>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-slate-500">
              <FilterX /> Clear ({activeFilterCount})
            </Button>
          )}
          <span className="ml-auto text-xs font-semibold text-slate-400">
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[136px] rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              {Filters}
            </div>
          </aside>

          {filtered.length ? (
            <div className="grid content-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => (
                <CommodityCard key={c.id} c={c} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <PackageSearch className="h-10 w-10 text-slate-300" />
              <h3 className="mt-4 font-display text-lg font-bold text-navy-950">No listings match your filters</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Try widening the badge threshold or clearing origin filters — new verified stock arrives weekly.
              </p>
              <Button variant="accent" className="mt-5" onClick={clearAll}>
                <FilterX /> Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
