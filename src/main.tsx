import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Layout, RequireRole } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Marketplace } from "@/pages/Marketplace";
import { ProductDetail } from "@/pages/ProductDetail";
import { HowItWorks } from "@/pages/HowItWorks";
import { Verification } from "@/pages/Verification";
import { Membership } from "@/pages/Membership";
import { About } from "@/pages/About";
import { SignIn } from "@/pages/auth/SignIn";
import { Register } from "@/pages/auth/Register";
import { ExporterDashboard } from "@/pages/dashboard/ExporterDashboard";
import { BuyerDashboard } from "@/pages/dashboard/BuyerDashboard";
import { NotFound } from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/product/:slug", element: <ProductDetail /> },
      { path: "/how-it-works", element: <HowItWorks /> },
      { path: "/verification", element: <Verification /> },
      { path: "/membership", element: <Membership /> },
      { path: "/about", element: <About /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard/exporter",
        element: (
          <RequireRole role="exporter">
            <ExporterDashboard />
          </RequireRole>
        ),
      },
      {
        path: "/dashboard/buyer",
        element: (
          <RequireRole role="buyer">
            <BuyerDashboard />
          </RequireRole>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
