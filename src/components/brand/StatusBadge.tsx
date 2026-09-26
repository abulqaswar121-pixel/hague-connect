import { Badge } from "@/components/ui/badge";
import type { RFQStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  RFQStatus,
  { label: string; variant: "warning" | "info" | "gold-soft" | "muted"; dot: string }
> = {
  awaiting: { label: "Awaiting Supplier Quotes", variant: "warning", dot: "bg-amber-500" },
  quotes_received: { label: "Quotes Received", variant: "info", dot: "bg-brandblue-500" },
  in_discussion: { label: "In Discussion", variant: "gold-soft", dot: "bg-gold-500" },
  closed: { label: "Closed", variant: "muted", dot: "bg-slate-400" },
};

export function RfqStatusBadge({
  status,
  quoteCount,
  className,
}: {
  status: RFQStatus;
  quoteCount?: number;
  className?: string;
}) {
  const meta = statusMeta[status];
  const label =
    status === "quotes_received" && quoteCount
      ? `${quoteCount} Quote${quoteCount > 1 ? "s" : ""} Received`
      : meta.label;
  return (
    <Badge variant={meta.variant} className={cn("gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {label}
    </Badge>
  );
}
