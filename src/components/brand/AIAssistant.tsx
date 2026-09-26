import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, SendHorizonal, Sparkles, Volume2, X } from "lucide-react";
import { commodities } from "@/data/commodities";
import { destinationPorts } from "@/data/content";
import { cn, fmtUsd, sleep } from "@/lib/utils";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppButton";
import { waLink, waMessages } from "@/lib/whatsapp";

/* ---------------------------------- brain ---------------------------------- */

interface ChatAction {
  label: string;
  href: string;
  external?: boolean;
}
interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const ALIASES: [string, ...string[]][] = [
  ["sesame"],
  ["cashew"],
  ["cocoa"],
  ["ginger", "split ginger"],
  ["hibiscus", "zobo"],
  ["chili", "chilli", "pepper", "ata rodo"],
  ["shea", "shea butter"],
  ["soybean", "soya", "soy"],
  ["mango", "mangoes", "dried mango"],
  ["kolanut", "kola", "kola nut", "kolanuts"],
];

function findCommodity(input: string) {
  const q = input.toLowerCase();
  return commodities.find((c) => {
    const name = c.name.toLowerCase();
    if (q.includes(name)) return true;
    return ALIASES.some((set) => set.some((a) => q.includes(a)) && set.some((a) => name.includes(a.split(" ")[0])));
  });
}

interface BrainReply {
  text: string;
  actions?: ChatAction[];
}

function brain(raw: string): BrainReply {
  const q = raw.toLowerCase().trim();

  // greetings
  if (/^(hi|hello|hey|good\s(morning|afternoon|evening)|howdy|hola)\b/.test(q) || q.length < 3) {
    return {
      text: "Hello! 👋 I'm Kemi, your Hague trade assistant. I can quote live FOB prices for any of our 10 commodities, explain the RFQ process, or estimate shipping times. What are you sourcing today?",
    };
  }

  // gratitude / bye
  if (/(thank|thanks|appreciate)/.test(q)) {
    return { text: "You're most welcome! 😊 If anything else comes up — prices, documents, lead times — I'm right here. Have a great trade day! 🇳🇬" };
  }

  // human / contact / whatsapp / call
  if (/(human|agent|person|staff|call|phone|whatsapp|contact|speak to)/.test(q)) {
    return {
      text: "Of course — our human trade desk replies on WhatsApp within ~4 hours, 7 days a week (Lagos time). Tap below and your message arrives pre-filled. 👇",
      actions: [
        { label: "Open WhatsApp desk", href: waLink(waMessages.general), external: true },
      ],
    };
  }

  // rfq / quote process
  if (/(rfq|request for quotation|how do i (get|request)|how does it work|process)/.test(q)) {
    return {
      text: "Our RFQ flow is 3 quick steps: 1️⃣ pick a commodity, volume & packaging → 2️⃣ destination port & Incoterm → 3️⃣ target price, inspection & docs. Quotes from badge-verified suppliers land in your Buyer dashboard in ~48h. Want to start one?",
      actions: [
        { label: "Browse the marketplace", href: "/marketplace" },
        { label: "Create buyer account", href: "/register" },
      ],
    };
  }

  // shipping / lead time / ports / freight
  if (/(ship|shipp|freight|lead time|how long|delivery|port|ocean|sea)/.test(q)) {
    const LEAD: Record<string, number> = {
      Rotterdam: 16, Hamburg: 18, Antwerp: 17, "Nhava Sheva": 21, Mundra: 22, Shanghai: 28, Qingdao: 26,
    };
    const listed = destinationPorts
      .filter((p) => LEAD[p.port])
      .slice(0, 5)
      .map((p) => `${p.port} ~${LEAD[p.port]}d`)
      .join(" · ");
    return {
      text: `Indicative ocean transit from Lagos Apapa: ${listed}. Every quote includes a booked vessel schedule — we never leave lead times to guesswork. 🚢`,
      actions: [{ label: "See destination coverage", href: "/#destinations" }],
    };
  }

  // verification / supplier / trust / scam
  if (/(verif|trust|legit|scam|supplier|exporter|badge|safe)/.test(q)) {
    return {
      text: "Every exporter on Hague is CAC & NEPC verified, with Bronze → Platinum tiers based on trade history, response metrics and reference checks. Platinum suppliers (top 2%) carry escrow-capable trade records. Verification badge is public on every product page. ✅",
      actions: [{ label: "How verification works", href: "/#verification" }],
    };
  }

  // price with commodity match
  const c = findCommodity(q);
  if (c && /(price|cost|rate|quote|fob|how much|per (ton|mt|kg))/.test(q)) {
    return {
      text: `${c.name} (${c.grade.split("—")[0].trim()}) — today's indicative FOB Lagos Apapa: ${fmtUsd(c.fobUsd)}/MT, trading ${fmtUsd(c.fobLow)}–${fmtUsd(c.fobHigh)} ${c.priceChangePct >= 0 ? "↑" : "↓"}${Math.abs(c.priceChangePct)}% this week. MOQ ${c.moqMt} MT. Want me to open the full spec sheet?`,
      actions: [{ label: `View ${c.name}`, href: `/product/${c.slug}` }],
    };
  }
  if (/(price|cost|rate|fob|market)/.test(q)) {
    const movers = [...commodities].sort((a, b) => b.priceChangePct - a.priceChangePct).slice(0, 3);
    return {
      text:
        "Top movers at Lagos Apapa today: " +
        movers
          .map(
            (m) =>
              `${m.name.split(" (")[0].split(" — ")[0]} ${fmtUsd(m.fobUsd)}/MT (${m.priceChangePct >= 0 ? "↑" : "↓"}${Math.abs(m.priceChangePct)}%)`,
          )
          .join(" · ") +
        ". Ask me about any specific commodity for its full band!",
      actions: [{ label: "Open marketplace", href: "/marketplace" }],
    };
  }

  // payment / lc / docs
  if (/(pay|payment|lc|letter of credit|tt|swift|deposit|docs|documents|certificate)/.test(q)) {
    return {
      text: "Standard terms: 30% / 70% TT against shipping documents, or irrevocable LC at sight for first trades ≥ $100k. Full doc pack — phytosanitary, fumigation, COA/form, clean-on-board BL, EUR.1 where applicable. 🔒",
      actions: [{ label: "Talk trade terms on WhatsApp", href: waLink(waMessages.general), external: true }],
    };
  }

  // moq / volume
  if (/(moq|minimum|volume|container|how many (tons|mt))/.test(q)) {
    return {
      text: "MOQs vary by line: sesame & cashew from 19 MT, cocoa 12.5 MT, ginger/hibiscus/chili 13 MT, kolanut 13 MT, shea 10 MT, dried mango 5 MT, soybeans 25 MT (1×40ft). Mixed containers possible on request. 📦",
      actions: [{ label: "Compare all commodities", href: "/marketplace" }],
    };
  }

  // who are you / company
  if (/(who are you|what are you|kemi|hague|about you|your name)/.test(q)) {
    return {
      text: "I'm Kemi ✨ — the AI trade assistant of Hague Import & Export, a Lagos-based platform connecting global buyers with NEPC-verified Nigerian exporters. I handle quick answers 24/7; complex deals go straight to our human trade desk. 🤝",
      actions: [{ label: "About Hague", href: "/about" }],
    };
  }

  // fallback
  return {
    text: "Hmm, that's a bit beyond my trading desk! 😅 Try asking me about prices (e.g. \"sesame price\"), RFQs, shipping times, MOQs or verification — or tap below to reach a human specialist on WhatsApp.",
    actions: [
      { label: "WhatsApp a specialist", href: waLink(waMessages.general), external: true },
    ],
  };
}

/* --------------------------------- widget ---------------------------------- */

const QUICK = ["💹 Today's prices", "📋 How do RFQs work?", "🚢 Shipping lead times", "👤 Human agent"];

let idSeq = 1;

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: idSeq++,
      role: "assistant",
      time: now(),
      text: "Hi there! I'm Kemi ✨ — your Hague AI trade assistant. Ask me for live FOB prices, RFQ help, shipping times… or tap a shortcut below.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setMessages((m) => [...m, { id: idSeq++, role: "user", text: t, time: now() }]);
    setInput("");
    setBusy(true);
    await sleep(650 + Math.random() * 650);
    const reply = brain(t);
    setMessages((m) => [...m, { id: idSeq++, role: "assistant", time: now(), ...reply }]);
    setBusy(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      {/* ------------------------------ launcher ------------------------------ */}
      <div className="fixed bottom-5 right-4 z-[70] sm:right-6">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="launcher"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Chat with Kemi, the Hague AI assistant"
              className="group relative block h-12 w-12 sm:h-14 sm:w-14"
            >
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-brandblue-500 via-vermilion-500 to-gold-400 opacity-70 blur-[5px] transition group-hover:opacity-100 animate-pulse" />
              <span className="relative block h-full w-full overflow-hidden rounded-full ring-2 ring-white/90 shadow-premium">
                <img
                  src="/images/ai-assistant.png"
                  alt="Kemi — Hague AI assistant"
                  className="h-full w-full object-cover object-top"
                />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-white">
                <Sparkles className="h-2 w-2" />
              </span>
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="pointer-events-none absolute -left-[11.5rem] top-1/2 hidden lg:block -translate-y-1/2 whitespace-nowrap rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white shadow-premium"
              >
                Hi! I'm <span className="text-gold-400">Kemi</span> — ask me anything ✨
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* -------------------------------- panel -------------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-4 z-[70] flex h-[min(560px,calc(100dvh-2.5rem))] w-[min(392px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-premium ring-1 ring-black/10 sm:right-6"
            role="dialog"
            aria-label="Hague AI assistant chat"
          >
            {/* header */}
            <div className="relative shrink-0 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 px-4 py-3.5">
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_80%_-10%,rgba(47,125,225,0.5),transparent_55%)]" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/images/ai-assistant.png"
                    alt="Kemi avatar"
                    className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-vermilion-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-navy-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                    Kemi <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  </p>
                  <p className="text-[11px] text-brandblue-300">
                    Hague AI Assistant · Online — replies instantly
                  </p>
                </div>
                <a
                  href={waLink(waMessages.general)}
                  target="_blank"
                  rel="noopener"
                  aria-label="Escalate to WhatsApp trade desk"
                  className="rounded-full p-2 text-emerald-400 transition hover:bg-white/10"
                >
                  <WhatsAppGlyph className="h-5 w-5" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3.5 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <img
                      src="/images/ai-assistant.png"
                      alt=""
                      className="mr-2 mt-auto h-7 w-7 shrink-0 rounded-full object-cover object-top ring-1 ring-brandblue-200"
                    />
                  )}
                  <div className={cn("max-w-[80%]", m.role === "user" && "text-right")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "rounded-br-md bg-gradient-to-br from-navy-800 to-navy-950 text-white"
                          : "rounded-bl-md bg-white text-navy-900 ring-1 ring-slate-200",
                      )}
                    >
                      {m.text}
                    </div>
                    {m.actions && (
                      <div className={cn("mt-1.5 flex flex-wrap gap-1.5", m.role === "user" && "justify-end")}>
                        {m.actions.map((a) => (
                          <a
                            key={a.label}
                            href={a.href}
                            {...(a.external ? { target: "_blank", rel: "noopener" } : {})}
                            className="inline-flex items-center gap-1 rounded-full bg-brandblue-50 px-3 py-1.5 text-[11px] font-semibold text-brandblue-700 ring-1 ring-brandblue-200 transition hover:bg-brandblue-100"
                          >
                            {a.label}
                            {a.external && <ExternalLink className="h-3 w-3" />}
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 px-1 text-[10px] text-navy-400">{m.time}</p>
                  </div>
                </motion.div>
              ))}

              {busy && (
                <div className="flex items-center gap-2">
                  <img
                    src="/images/ai-assistant.png"
                    alt=""
                    className="h-7 w-7 rounded-full object-cover object-top ring-1 ring-brandblue-200"
                  />
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-slate-200">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-brandblue-500"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* quick replies */}
            <div className="shrink-0 flex gap-1.5 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2 [scrollbar-width:none]">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => void send(q)}
                  disabled={busy}
                  className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-navy-700 transition hover:bg-brandblue-50 hover:text-brandblue-700 disabled:opacity-50"
                >
                  {q.replace(/^(💹|📋|🚢|👤)\s?/, "")}
                </button>
              ))}
            </div>

            {/* composer */}
            <form onSubmit={onSubmit} className="shrink-0 border-t border-slate-100 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about prices, RFQs, shipping…"
                    aria-label="Message Kemi"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-[13px] outline-none transition focus:border-brandblue-400 focus:bg-white focus:ring-2 focus:ring-brandblue-100"
                  />
                  <Volume2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-vermilion-500 to-vermilion-700 text-white shadow-md shadow-vermilion-500/30 transition hover:brightness-110 disabled:opacity-40"
                >
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
