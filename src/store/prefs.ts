import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/types";

export const languages = [
  { code: "EN", label: "English", live: true },
  { code: "FR", label: "Français", live: false },
  { code: "ZH", label: "中文", live: false },
  { code: "ES", label: "Español", live: false },
  { code: "AR", label: "العربية", live: false },
];

interface PrefsState {
  currency: Currency;
  language: string;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  setLanguage: (code: string) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      currency: "USD",
      language: "EN",
      setCurrency: (currency) => set({ currency }),
      toggleCurrency: () =>
        set((s) => ({ currency: s.currency === "USD" ? "NGN" : "USD" })),
      setLanguage: (language) => set({ language }),
    }),
    { name: "hague-prefs" }
  )
);
