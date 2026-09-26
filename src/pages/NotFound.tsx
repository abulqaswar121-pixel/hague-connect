import { useNavigate } from "react-router-dom";
import { Compass, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 text-white">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-6 font-mono text-sm font-bold tracking-[0.3em] text-vermilion-600">404 · OFF COURSE</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
        This trade lane doesn't exist
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        The page you're looking for was moved, renamed, or never left the port. Let's get your
        cargo back on route.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="accent" onClick={() => navigate("/")}>
          <Home /> Back to Homepage
        </Button>
        <Button variant="outline" onClick={() => navigate("/marketplace")}>
          <Store /> Open Marketplace
        </Button>
      </div>
    </div>
  );
}
