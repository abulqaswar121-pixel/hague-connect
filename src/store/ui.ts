import { create } from "zustand";
import type { Commodity } from "@/types";

interface UiState {
  rfqOpen: boolean;
  rfqCommodity: Commodity | null;
  openRfq: (commodity: Commodity) => void;
  closeRfq: () => void;
}

/** UI-only store — controls the global multi-step RFQ modal. */
export const useUi = create<UiState>()((set) => ({
  rfqOpen: false,
  rfqCommodity: null,
  openRfq: (commodity) => set({ rfqOpen: true, rfqCommodity: commodity }),
  closeRfq: () => set({ rfqOpen: false, rfqCommodity: null }),
}));
