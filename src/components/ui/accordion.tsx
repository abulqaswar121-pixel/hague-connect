import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionCtx {
  open: string | null;
  setOpen: (v: string | null) => void;
  collapsible: boolean;
}
const Ctx = React.createContext<AccordionCtx | null>(null);

export function Accordion({
  type = "single",
  collapsible = true,
  className,
  children,
}: {
  type?: "single";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpenState] = React.useState<string | null>(null);
  const setOpen = (v: string | null) =>
    setOpenState((cur) => (collapsible && cur === v ? null : v));
  return (
    <Ctx.Provider value={{ open, setOpen, collapsible }}>
      <div className={className} data-type={type}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

const ItemCtx = React.createContext<string>("");

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(Ctx);
  const isOpen = ctx?.open === value;
  return (
    <ItemCtx.Provider value={value}>
      <div className={className} data-state={isOpen ? "open" : "closed"} {...props}>
        {children}
      </div>
    </ItemCtx.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(Ctx);
  const value = React.useContext(ItemCtx);
  const isOpen = ctx?.open === value;
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-4 font-medium transition-all",
        className
      )}
      onClick={() => ctx?.setOpen(value)}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300",
          isOpen && "rotate-180 text-vermilion-600"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(Ctx);
  const value = React.useContext(ItemCtx);
  const isOpen = ctx?.open === value;
  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}
