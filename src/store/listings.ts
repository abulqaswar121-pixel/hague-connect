import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Commodity } from "@/types";
import { commodities as baseCommodities } from "@/data/commodities";
import { uid } from "@/lib/utils";

export interface NewListingInput {
  name: string;
  category: string;
  grade: string;
  origin: string[];
  moqMt: number;
  fobUsd: number;
  packaging: string[];
  description: string;
  supplierName?: string;
}

interface ListingsState {
  custom: Commodity[];
  addListing: (input: NewListingInput) => Commodity;
  removeListing: (id: string) => void;
}

export const useListings = create<ListingsState>()(
  persist(
    (set) => ({
      custom: [],
      addListing: (input) => {
        const c: Commodity = {
          id: uid("cus-"),
          slug: uid("listing-"),
          name: input.name,
          category: input.category,
          hsCode: "Pending",
          grade: input.grade,
          origin: input.origin,
          harvestSeason: "2025/26",
          fobUsd: input.fobUsd,
          fobLow: Math.round(input.fobUsd * 0.94),
          fobHigh: Math.round(input.fobUsd * 1.08),
          priceChangePct: 0,
          moqMt: input.moqMt,
          packaging: input.packaging,
          incoterms: ["FOB", "CIF"],
          ports: ["Lagos Apapa"],
          specs: [
            { label: "Quality", value: input.grade },
            { label: "MOQ", value: `${input.moqMt} MT` },
            { label: "Status", value: "New listing — specs pending verification" },
          ],
          description: input.description,
          supplierIds: [],
          isCustom: true,
          createdAt: Date.now(),
        };
        set((s) => ({ custom: [c, ...s.custom] }));
        return c;
      },
      removeListing: (id) =>
        set((s) => ({ custom: s.custom.filter((c) => c.id !== id) })),
    }),
    { name: "hague-listings" }
  )
);

/** Merge user-created listings with the static catalogue. */
export function useAllCommodities(): Commodity[] {
  const custom = useListings((s) => s.custom);
  return [...custom, ...baseCommodities];
}

export function allCommoditiesSnapshot(custom: Commodity[]): Commodity[] {
  return [...custom, ...baseCommodities];
}
