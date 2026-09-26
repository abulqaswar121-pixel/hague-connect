import { Button, type ButtonProps } from "@/components/ui/button";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.02-1.37l-.36-.22-3.73.98 1-3.64-.24-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.9 9.88M20.5 3.49A11.8 11.8 0 0 0 12.05 0C5.53 0 .22 5.3.22 11.83c0 2.08.55 4.12 1.58 5.92L.13 24l6.4-1.68a11.8 11.8 0 0 0 5.5 1.4h.01c6.51 0 11.82-5.3 11.82-11.83 0-3.16-1.23-6.13-3.36-8.4Z" />
    </svg>
  );
}

interface WhatsAppButtonProps extends ButtonProps {
  message: string;
}

export function WhatsAppButton({
  message,
  children = "WhatsApp Inquiry",
  className,
  variant = "whatsapp",
  size = "default",
  ...props
}: WhatsAppButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault();
        window.open(waLink(message), "_blank", "noopener");
      }}
      {...props}
    >
      <WhatsAppGlyph />
      {children}
    </Button>
  );
}
