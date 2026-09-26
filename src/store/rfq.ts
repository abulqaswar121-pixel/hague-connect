import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Quote, RFQ, RFQStatus } from "@/types";
import { seedQuotes, seedRfqs } from "@/data/seed";
import { uid } from "@/lib/utils";
import { genRef } from "@/lib/format";

export interface NewQuoteInput {
  rfqId: string;
  supplierId?: string;
  supplierName: string;
  badge: Quote["badge"];
  priceUsd: number;
  incoterm: string;
  leadTimeDays: number;
  validDays: number;
  notes?: string;
}

interface TradeState {
  rfqs: RFQ[];
  quotes: Quote[];
  addRfq: (rfq: Omit<RFQ, "id" | "ref" | "status" | "createdAt">) => RFQ;
  addQuote: (q: NewQuoteInput) => Quote;
  setQuoteStatus: (quoteId: string, status: Quote["status"]) => void;
  setRfqStatus: (rfqId: string, status: RFQStatus) => void;
  quotesForRfq: (rfqId: string) => Quote[];
  quoteCount: (rfqId: string) => number;
  resetSeeds: () => void;
}

export const useTrade = create<TradeState>()(
  persist(
    (set, get) => ({
      rfqs: seedRfqs,
      quotes: seedQuotes,

      addRfq: (input) => {
        const rfq: RFQ = {
          ...input,
          id: uid("rfq-"),
          ref: genRef("RFQ"),
          status: "awaiting",
          createdAt: Date.now(),
        };
        set((s) => ({ rfqs: [rfq, ...s.rfqs] }));
        return rfq;
      },

      addQuote: (q) => {
        const quote: Quote = {
          ...q,
          id: uid("qt-"),
          ref: genRef("QT").replace("QT-2026-", "QT-"),
          status: "pending",
          createdAt: Date.now(),
        };
        set((s) => ({
          quotes: [quote, ...s.quotes],
          rfqs: s.rfqs.map((r) =>
            r.id === q.rfqId
              ? { ...r, status: "quotes_received" as RFQStatus }
              : r
          ),
        }));
        return quote;
      },

      setQuoteStatus: (quoteId, status) =>
        set((s) => ({
          quotes: s.quotes.map((q) => (q.id === quoteId ? { ...q, status } : q)),
        })),

      setRfqStatus: (rfqId, status) =>
        set((s) => ({
          rfqs: s.rfqs.map((r) => (r.id === rfqId ? { ...r, status } : r)),
        })),

      quotesForRfq: (rfqId) =>
        get()
          .quotes.filter((q) => q.rfqId === rfqId)
          .sort((a, b) => a.priceUsd - b.priceUsd),

      quoteCount: (rfqId) => get().quotes.filter((q) => q.rfqId === rfqId).length,

      resetSeeds: () => set({ rfqs: seedRfqs, quotes: seedQuotes }),
    }),
    { name: "hague-trade" }
  )
);
