import type { MembershipTier, VerificationTier } from "@/types";

/* ---------------------------------- ports --------------------------------- */

export const nigerianPorts = [
  "Lagos Apapa",
  "Tin Can Island",
  "Port Harcourt",
  "Onne",
  "Calabar",
];

export const destinationPorts = [
  { port: "Hamburg", country: "Germany" },
  { port: "Rotterdam", country: "Netherlands" },
  { port: "Antwerp", country: "Belgium" },
  { port: "Nhava Sheva", country: "India" },
  { port: "Mundra", country: "India" },
  { port: "Shanghai", country: "China" },
  { port: "Qingdao", country: "China" },
  { port: "Ho Chi Minh City (Cat Lai)", country: "Vietnam" },
  { port: "Jebel Ali", country: "United Arab Emirates" },
  { port: "Mersin", country: "Türkiye" },
  { port: "New York / New Jersey", country: "United States" },
  { port: "Houston", country: "United States" },
  { port: "Veracruz", country: "Mexico" },
  { port: "Tokyo", country: "Japan" },
  { port: "Busan", country: "South Korea" },
  { port: "Durban", country: "South Africa" },
];

export const destinationCountries = Array.from(
  new Set(destinationPorts.map((d) => d.country))
).sort();

/* --------------------------- verification tiers ---------------------------- */

export interface VerificationTierInfo {
  id: VerificationTier;
  name: string;
  tagline: string;
  color: string; // tailwind-ish hex for chips
  requirements: string[];
  perks: string[];
}

export const verificationTiers: VerificationTierInfo[] = [
  {
    id: "bronze",
    name: "Bronze",
    tagline: "Basic Verification",
    color: "#B0783C",
    requirements: [
      "Registered account with verified email & phone",
      "Company profile with physical address",
      "One trade reference on file",
    ],
    perks: ["Marketplace listing access", "Bronze trust badge", "Standard search placement"],
  },
  {
    id: "silver",
    name: "Silver",
    tagline: "Document Verified — CAC / NEPC",
    color: "#8FA3BC",
    requirements: [
      "CAC certificate of incorporation (RC number validated)",
      "Valid NEPC exporter registration certificate",
      "Tax Identification Number (TIN) matched",
    ],
    perks: [
      "Document-verified badge on all listings",
      "Access to international buyer RFQ feed",
      "Dispute mediation eligibility",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "Site Inspection Verified",
    color: "#D97706",
    requirements: [
      "Physical warehouse / processing facility inspection",
      "Quality control process audit (HACCP-aligned)",
      "Minimum 3 completed trade references",
      "Verified export track record (≥ 12 months)",
    ],
    perks: [
      "Priority ranking in buyer search results",
      "Gold badge + verified capacity figures",
      "Invitation to curated trade missions",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "International Trade Certified",
    color: "#0A192F",
    requirements: [
      "Annual compliance re-audit by third-party surveyor",
      "International certification (ISO 22000 / Organic / FairTrade)",
      "Clean 24-month dispute record",
      "Bank trade-instrument readiness (LC / CAD verified)",
    ],
    perks: [
      "Platinum trust seal across the platform",
      "First access to enterprise & government tenders",
      "Dedicated Hague trade desk officer",
      "Escrow & trade-finance fast lane (Phase 2)",
    ],
  },
];

export const tierRank: Record<VerificationTier, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

/* ------------------------------ membership --------------------------------- */

export interface MembershipPlan {
  name: MembershipTier;
  price: string;
  priceNote: string;
  blurb: string;
  cta: string;
  popular?: boolean;
  features: { label: string; included: boolean }[];
}

export const membershipPlans: MembershipPlan[] = [
  {
    name: "Free",
    price: "$0",
    priceNote: "forever",
    blurb: "Explore the market and test the waters.",
    cta: "Start Free",
    features: [
      { label: "Browse full marketplace", included: true },
      { label: "3 RFQs / month (buyers)", included: true },
      { label: "1 product listing (exporters)", included: true },
      { label: "Bronze verification badge", included: true },
      { label: "Standard support (48h)", included: true },
      { label: "Verification upgrades", included: false },
      { label: "Priority search placement", included: false },
      { label: "Trade analytics dashboard", included: false },
    ],
  },
  {
    name: "Professional",
    price: "$250",
    priceNote: "per year",
    blurb: "For serious traders building a track record.",
    cta: "Go Professional",
    features: [
      { label: "Unlimited RFQs & quotes", included: true },
      { label: "Up to 10 product listings", included: true },
      { label: "Silver verification included", included: true },
      { label: "RFQ feed alerts by email", included: true },
      { label: "Priority support (12h)", included: true },
      { label: "Trade analytics dashboard", included: true },
      { label: "Priority search placement", included: false },
      { label: "Dedicated trade desk", included: false },
    ],
  },
  {
    name: "Corporate",
    price: "$500",
    priceNote: "per year",
    blurb: "Full-power toolkit for scaling export houses.",
    cta: "Choose Corporate",
    popular: true,
    features: [
      { label: "Unlimited RFQs & quotes", included: true },
      { label: "Unlimited product listings", included: true },
      { label: "Gold site inspection included", included: true },
      { label: "Priority search placement", included: true },
      { label: "Trade analytics + price intel preview", included: true },
      { label: "Contract templates & LC advisory", included: true },
      { label: "Priority support (4h)", included: true },
      { label: "Dedicated trade desk", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "$1,000 – $5,000",
    priceNote: "per year, tailored",
    blurb: "Institutional grade for volume traders & buyers.",
    cta: "Talk to Sales",
    features: [
      { label: "Everything in Corporate", included: true },
      { label: "Platinum certification pathway", included: true },
      { label: "Dedicated trade desk officer", included: true },
      { label: "Custom contract & escrow workflows", included: true },
      { label: "API access & ERP integration", included: true },
      { label: "Government / tender deal room", included: true },
      { label: "On-site team training", included: true },
      { label: "SLA-backed 1h support", included: true },
    ],
  },
];

/* ------------------------------- how it works ------------------------------ */

export const howItWorksSteps = [
  {
    step: "01",
    title: "Search & Verify",
    body: "Filter verified commodity listings by origin, grade and supplier badge. Every exporter is screened through our 4-tier trust system.",
  },
  {
    step: "02",
    title: "Submit RFQ",
    body: "Send a structured Request for Quotation with volume, Incoterm, destination port and inspection requirements — in under 2 minutes.",
  },
  {
    step: "03",
    title: "Negotiate & Contract",
    body: "Compare competing supplier quotes side-by-side, chat directly, and lock terms with Hague-standard sales contract templates.",
  },
  {
    step: "04",
    title: "Inspect & Ship",
    body: "Third-party inspection (SGS / Bureau Veritas) at loading, documents checked, cargo tracked to your destination port.",
  },
];

export const testimonials = [
  {
    quote:
      "We consolidated three sesame suppliers through Hague Export and cut our sourcing cycle from six weeks to nine days. The verification badges are the real deal.",
    name: "Mehmet Yilmaz",
    role: "Head of Procurement, Bosphorus Foods",
    country: "Türkiye",
  },
  {
    quote:
      "As a first-time buyer of Nigerian hibiscus, the Gold-tier inspection report gave our board the confidence to sign a 12-month supply contract.",
    name: "Maria Fernanda López",
    role: "Director, Andina Botanicals S.A.",
    country: "Mexico",
  },
  {
    quote:
      "Within our first quarter on Hague Export we quoted 41 RFQs and shipped 2,300 MT of RCN. The buyer quality is unlike anything on open marketplaces.",
    name: "Adaeze Okafor",
    role: "MD/CEO, Sahel Prime Exports Ltd",
    country: "Nigeria",
  },
];

export const stats = {
  exporters: "480+",
  commodities: "35",
  countries: "62",
  mtTraded: "210K MT",
};
