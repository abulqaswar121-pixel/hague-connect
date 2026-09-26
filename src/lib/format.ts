import type { Currency } from "@/types";

/** Indicative parallel-market reference rate used across the preview. */
export const NGN_RATE = 1550;

export function convertUsd(usd: number, currency: Currency): number {
  return currency === "NGN" ? usd * NGN_RATE : usd;
}

export function fmtMoney(
  usd: number,
  currency: Currency,
  opts: { compact?: boolean; decimals?: number } = {}
): string {
  const value = convertUsd(usd, currency);
  const nf = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: opts.decimals ?? 0,
    minimumFractionDigits: opts.decimals ?? 0,
    ...(opts.compact ? { notation: "compact" } : {}),
  });
  return nf.format(value);
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function fmtPct(p: number): string {
  return `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} mo${months > 1 ? "s" : ""} ago`;
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function genRef(prefix: string): string {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `${prefix}-2026-${num}`;
}
