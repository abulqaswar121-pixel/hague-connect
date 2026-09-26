import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";
import { uid } from "@/lib/utils";

export const DEMO_EXPORTER: User = {
  id: "demo-exporter",
  name: "Adaeze Okafor",
  email: "adaeze@sahelprime.ng",
  role: "exporter",
  company: "Sahel Prime Exports Ltd",
  country: "Nigeria",
  rcNumber: "RC-1284756",
  primaryCommodity: "Sesame Seeds",
  tier: "Corporate",
  verification: "gold",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 380,
  profileViews: 1284,
};

export const DEMO_BUYER: User = {
  id: "demo-buyer",
  name: "James Whitfield",
  email: "j.whitfield@whitfieldcommodities.de",
  role: "buyer",
  company: "Whitfield Commodities GmbH",
  country: "Germany",
  tier: "Professional",
  verification: "silver",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 210,
};

interface RegisterPayload {
  name: string;
  email: string;
  company: string;
  country: string;
  role: Role;
  rcNumber?: string;
  primaryCommodity?: string;
}

interface AuthState {
  user: User | null;
  /** Any valid-looking credentials are accepted in the Phase-1 preview. */
  signIn: (email: string, role: Role) => User;
  signUp: (payload: RegisterPayload) => User;
  demoSignIn: (role: Role) => User;
  signOut: () => void;
  setVerification: (tier: User["verification"]) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, role) => {
        const handle = email.split("@")[0].replace(/[._]/g, " ").trim();
        const pretty = handle
          ? handle.replace(/\b\w/g, (c) => c.toUpperCase())
          : "Trade User";
        // Preserve seed ownership when a demo-shaped email is used.
        const isDemoBuyer = /whitfield|buyer/i.test(email);
        const user: User =
          role === "buyer"
            ? {
                ...DEMO_BUYER,
                id: isDemoBuyer ? "demo-buyer" : uid("buyer-"),
                name: pretty,
                email,
                company: `${pretty.split(" ")[0]} Global Sourcing Ltd`,
              }
            : {
                ...DEMO_EXPORTER,
                id: uid("exp-"),
                name: pretty,
                email,
                company: `${pretty.split(" ")[0]} Agro Exports Ltd`,
                tier: "Free",
                verification: "bronze",
                profileViews: 12,
              };
        set({ user });
        return user;
      },
      signUp: (p) => {
        const user: User = {
          id: uid(p.role === "buyer" ? "buyer-" : "exp-"),
          name: p.name,
          email: p.email,
          role: p.role,
          company: p.company,
          country: p.country,
          rcNumber: p.rcNumber,
          primaryCommodity: p.primaryCommodity,
          tier: "Free",
          verification: "bronze",
          createdAt: Date.now(),
          profileViews: 3,
        };
        set({ user });
        return user;
      },
      demoSignIn: (role) => {
        const user = role === "buyer" ? DEMO_BUYER : DEMO_EXPORTER;
        set({ user });
        return user;
      },
      signOut: () => set({ user: null }),
      setVerification: (tier) =>
        set((s) => (s.user ? { user: { ...s.user, verification: tier } } : {})),
    }),
    { name: "hague-auth" }
  )
);
