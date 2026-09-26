import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RFQModal } from "@/components/rfq/RFQModal";
import { AIAssistant } from "@/components/brand/AIAssistant";
import { useAuth } from "@/store/auth";
import type { Role } from "@/types";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RFQModal />
      <AIAssistant />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif" },
        }}
      />
    </div>
  );
}

export function RequireRole({ role, children }: { role: Role; children: JSX.Element }) {
  const user = useAuth((s) => s.user);
  if (!user) {
    toast.error("Sign in required", {
      description: "Use any email — or a one-click demo preset — to open a dashboard.",
    });
    return <Navigate to="/sign-in" replace />;
  }
  if (user.role !== role) {
    const other = user.role === "exporter" ? "/dashboard/exporter" : "/dashboard/buyer";
    toast.info("Redirected", {
      description: `You're signed in as a${user.role === "exporter" ? "n exporter" : " buyer"}.`,
    });
    return <Navigate to={other} replace />;
  }
  return children;
}
