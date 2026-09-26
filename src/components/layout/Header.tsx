import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronDown,
  CircleDollarSign,
  Globe,
  Headset,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppButton";
import { VerificationBadge } from "@/components/brand/VerificationBadge";
import { PriceTicker } from "./Ticker";
import { useAuth } from "@/store/auth";
import { languages, usePrefs } from "@/store/prefs";
import { waLink, waMessages, WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/verification", label: "Verification" },
  { to: "/membership", label: "Membership" },
  { to: "/about", label: "About Us" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group flex items-center" aria-label="Hague Import & Export — home">
      <img
        src={dark ? "/brand/logo-wide.png" : "/brand/logo-wide-dark.png"}
        alt="HAGUE Import & Export"
        className={cn(
          "w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]",
          dark ? "h-11" : "h-10 lg:h-11 [filter:drop-shadow(0_1px_5px_rgba(255,255,255,0.10))_drop-shadow(0_2px_8px_rgba(0,0,0,0.35))]"
        )}
      />
    </Link>
  );
}

export function Header() {
  const { currency, toggleCurrency, language, setLanguage } = usePrefs();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = user?.role === "exporter" ? "/dashboard/exporter" : "/dashboard/buyer";

  return (
    <header className="sticky top-0 z-[60]">
      {/* utility strip */}
      <div className="bg-navy-950 text-white">
        <div className="container flex h-8 items-center justify-between text-[11px]">
          <div className="flex items-center gap-4 min-w-0">
            <a
              href={waLink(waMessages.support)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-semibold text-white/70 transition-colors hover:text-white"
            >
              <Headset className="h-3 w-3 text-vermilion-400" />
              <span className="hidden sm:inline">Trade Support Desk</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <WhatsAppGlyph className="h-3 w-3" /> {WHATSAPP_DISPLAY}
              </span>
            </a>
            <a href="mailto:tradedesk@hague-export.com" className="hidden items-center gap-1.5 font-semibold text-white/70 transition-colors hover:text-white lg:flex">
              <Mail className="h-3 w-3 text-brandblue-400" /> tradedesk@hague-export.com
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                toggleCurrency();
                toast.success(`Prices now shown in ${currency === "USD" ? "Nigerian Naira (₦)" : "US Dollars ($)"}`);
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              title="Toggle display currency"
            >
              <CircleDollarSign className="h-3.5 w-3.5 text-gold-400" />
              {currency}
              <span className="text-white/35">|</span>
              <span className="text-white/40">{currency === "USD" ? "NGN" : "USD"}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white">
                <Globe className="h-3.5 w-3.5 text-gold-400" />
                {language}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Platform language</DropdownMenuLabel>
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => {
                      if (l.live) {
                        setLanguage(l.code);
                      } else {
                        toast.info(`${l.label} arrives in Phase 2`, {
                          description: "Hague Export is launching multi-language support soon. English remains live in this preview.",
                        });
                      }
                    }}
                  >
                    <span className="w-8 font-mono text-xs font-bold">{l.code}</span> {l.label}
                    {!l.live && <Badge variant="muted" className="ml-auto text-[9px]">soon</Badge>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* main nav */}
      <div className="border-b border-white/10 bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/85">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                    isActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 outline-none transition-colors hover:bg-white/10">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-vermilion-600 font-display text-xs font-extrabold text-white">
                    {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-[130px] truncate text-xs font-bold text-white">{user.name}</span>
                    <span className="block text-[10px] font-semibold capitalize text-gold-400">
                      {user.role === "exporter" ? "Exporter" : "Buyer"} · {user.tier}
                    </span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-white/50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2.5 py-2">
                    <p className="text-sm font-bold text-navy-950">{user.company}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <VerificationBadge tier={user.verification} size="sm" />
                      <Badge variant="gold-soft">{user.tier} plan</Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                    <LayoutDashboard /> My {user.role === "exporter" ? "Exporter" : "Buyer"} Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/marketplace")}>
                    <UserRound /> Public Marketplace
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 [&_svg]:text-red-400"
                    onClick={() => {
                      signOut();
                      toast.success("Signed out", { description: "Your session data stays saved on this device." });
                      navigate("/");
                    }}
                  >
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost-light" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/sign-in")}>
                  Sign In
                </Button>
                <Button variant="accent" size="sm" onClick={() => navigate("/register")}>
                  Register Free
                </Button>
              </>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost-light" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-navy-950 text-white border-r-white/10 p-0">
                <div className="border-b border-white/10 p-5">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {nav.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "rounded-lg px-3 py-2.5 text-sm font-semibold",
                          isActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5"
                        )
                      }
                    >
                      {n.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-auto border-t border-white/10 p-4">
                  {user ? (
                    <Button className="w-full" variant="accent" onClick={() => { setMobileOpen(false); navigate(dashboardPath); }}>
                      <LayoutDashboard /> My Dashboard
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline-light" onClick={() => { setMobileOpen(false); navigate("/sign-in"); }}>Sign In</Button>
                      <Button variant="accent" onClick={() => { setMobileOpen(false); navigate("/register"); }}>Register</Button>
                    </div>
                  )}
                  <a
                    href={waLink(waMessages.general)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/15 py-2.5 text-xs font-bold text-emerald-300"
                  >
                    <WhatsAppGlyph /> Chat with Trade Desk
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <PriceTicker />
    </header>
  );
}
