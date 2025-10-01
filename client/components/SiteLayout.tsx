import { Outlet } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

export function SiteLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(60,80,255,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(111,75,255,0.14),_transparent_45%),_rgb(6,10,26)] text-foreground">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-pink-500/30 blur-3xl" />
      </div>
    </div>
  );
}
