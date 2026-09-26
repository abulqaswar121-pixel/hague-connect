export type VerificationTier = "bronze" | "silver" | "gold" | "platinum";
export type Role = "buyer" | "exporter";
export type Incoterm = "FOB" | "CIF" | "CFR";
export type Currency = "USD" | "NGN";
export type MembershipTier = "Free" | "Professional" | "Corporate" | "Enterprise";

export interface Spec {
  label: string;
  value: string;
}

export interface Commodity {
  id: string;
  slug: string;
  name: string;
  category: string;
  hsCode: string;
  image?: string;
  grade: string;
  origin: string[];
  harvestSeason: string;
  fobUsd: number;
  fobLow: number;
  fobHigh: number;
  priceChangePct: number;
  moqMt: number;
  packaging: string[];
  incoterms: Incoterm[];
  ports: string[];
  specs: Spec[];
  description: string;
  supplierIds: string[];
  featured?: boolean;
  isCustom?: boolean;
  createdAt?: number;
}

export interface Supplier {
  id: string;
  name: string;
  rcNumber: string;
  state: string;
  badge: VerificationTier;
  nepc: boolean;
  cac: boolean;
  yearsActive: number;
  responseRate: number;
  avgResponseHrs: number;
  exportedMt: number;
  rating: number;
  commodities: string[];
}

export type RFQStatus = "awaiting" | "quotes_received" | "in_discussion" | "closed";

export interface RFQ {
  id: string;
  ref: string;
  commodityId: string;
  commodityName: string;
  hsCode: string;
  quantityMt: number;
  timeline: string;
  incoterm: string;
  destinationCountry: string;
  destinationPort: string;
  targetMinUsd: number;
  targetMaxUsd: number;
  packaging: string;
  inspections: string[];
  notes?: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  ownerId: string;
  status: RFQStatus;
  createdAt: number;
}

export interface Quote {
  id: string;
  ref: string;
  rfqId: string;
  supplierId?: string;
  supplierName: string;
  badge: VerificationTier;
  priceUsd: number;
  incoterm: string;
  leadTimeDays: number;
  validDays: number;
  notes?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company: string;
  country: string;
  rcNumber?: string;
  primaryCommodity?: string;
  tier: MembershipTier;
  verification: VerificationTier;
  createdAt: number;
  profileViews?: number;
}
