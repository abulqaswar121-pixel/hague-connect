# Hague Export — Phase 1 Interactive Preview

A production-grade, fully interactive B2B trade platform preview for **hague-export.com**,
developed by **Hague Digital Solutions (RC-3789349)** — *Connect. Trade. Grow.*

High-fidelity Phase 1 build: every page, interaction and flow behaves like a live SaaS
platform with **no external database**. All data runs through a typed mock service layer
(Zustand + `localStorage`) so RFQs, sign-ups, quotes and new listings persist across
navigation and browser refreshes.

## Quick start

```bash
npm install        # one-time
npm run dev        # dev server on http://localhost:5173
```

Production check:

```bash
npm run build      # outputs static bundle to dist/
npm run preview    # serves the built bundle on http://localhost:4173
```

The `dist/` folder in this archive is already built — drop it on any static host
(Netlify, Vercel, S3, nginx) to verify without a Node toolchain.

## Demo credentials (no real auth in Phase 1)

- **Sign in** accepts any valid-looking email + password (4+ chars) and routes to the
  dashboard matching the chosen role.
- One-click presets on the sign-in page:
  - *Demo as Top-Tier Exporter* — Corporate plan, Gold verification, live RFQ feed
  - *Demo as Global Commodity Buyer* — preloaded RFQs & comparable supplier quotes

## What's inside

| Area | Highlights |
|---|---|
| Marketplace | Faceted filters (category, origin, grade, Incoterm, packaging, supplier badge tier), live search, sorting |
| Product pages | Full technical spec sheets, FOB price cards, supplier verification panels, WhatsApp deep links |
| RFQ engine | 3-step wizard (volume → Incoterm/destination → pricing/inspection), success flow into Buyer dashboard |
| Auth | Buyer/Exporter toggle, exporter RC-number capture, demo presets |
| Exporter dashboard | Metrics, incoming RFQ feed with Send-Quote composer, Add-Commodity publisher, verification journey |
| Buyer dashboard | RFQ tracking, quote comparison drawer with Accept/Decline + WhatsApp chat |
| Brand system | Official Hague Import & Export lockups (light + reversed), navy / vermilion / gold / globe-blue palette |

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Radix UI (shadcn-style kit) · Zustand ·
Framer Motion · Sonner · Pillow (brand asset pipeline in `scripts/`)

## Notes

- Display currency toggles USD ⇄ NGN (reference rate ₦1,550) site-wide.
- WhatsApp trade desk: `wa.me/2348103954351` with context-prefilled messages.
- This is a demonstration build: marketplace data is illustrative; no live payments,
  logistics bookings or binding contracts are processed.

© 2026 Hague Digital Solutions (RC-3789349), Lagos, Nigeria.
