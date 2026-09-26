export const WHATSAPP_NUMBER = "2348103954351";
export const WHATSAPP_DISPLAY = "+234 810 395 4351";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general: `Hello Hague Export Trade Desk, I'd like to make an inquiry about sourcing verified Nigerian commodities. (via hague-export.com)`,
  product: (name: string, hs: string, moq: number) =>
    `Hello Hague Export, I'm interested in ${name} (HS ${hs}) — MOQ ${moq} MT. Please share your best FOB Apapa offer and current availability. Ref: hague-export.com`,
  supplier: (supplier: string, product: string) =>
    `Hello Hague Export, please connect me with ${supplier} regarding their ${product} listing on hague-export.com. I'd like to discuss volumes and pricing.`,
  quote: (supplier: string, quoteRef: string, commodity: string) =>
    `Hello Hague Export, this is regarding quote ${quoteRef} from ${supplier} for ${commodity}. I'd like to proceed with discussions. Ref: hague-export.com`,
  rfq: (ref: string, commodity: string, qty: number) =>
    `Hello Hague Export, following up on RFQ ${ref} — ${qty} MT of ${commodity}. Please advise on supplier matching status. Ref: hague-export.com`,
  support: `Hello Hague Export Trade Support Desk, I need assistance with my account / a live trade. (via hague-export.com)`,
  exporter: (company: string) =>
    `Hello Hague Export, this is ${company}. We'd like support with our exporter account and listed commodities. Ref: hague-export.com`,
};
