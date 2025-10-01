import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink =
  | { label: string; to: string; type: "route" }
  | { label: string; href: string; type: "anchor" };

const navLinks: NavLink[] = [
  { label: "Features", href: "/#features", type: "anchor" },
  { label: "How it works", href: "/#how-it-works", type: "anchor" },
  { label: "Explain code", to: "/explain", type: "route" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  const renderLink = (link: NavLink, isMobile = false) => {
    const baseClasses =
      "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200";

    if (link.type === "route") {
      return (
        <Link
          key={link.label}
          to={link.to}
          onClick={() => setOpen(false)}
          className={cn(
            baseClasses,
            isActivePath(link.to)
              ? "bg-white/10 text-white"
              : "text-white/70 hover:text-white hover:bg-white/5",
            isMobile && "w-full text-left",
          )}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.label}
        href={link.href}
        onClick={() => setOpen(false)}
        className={cn(
          baseClasses,
          "text-white/70 hover:text-white hover:bg-white/5",
          isMobile && "w-full text-left",
        )}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[rgba(10,14,32,0.7)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Linewise home">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/60 to-indigo-500">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Linewise</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => renderLink(link))}
          <Button asChild className="rounded-full bg-white text-gray-900 hover:bg-white/90">
            <Link to="/explain">Try the explainer</Link>
          </Button>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:bg-white/10 hover:text-white"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[rgba(8,12,28,0.9)] px-4 pb-6 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => renderLink(link, true))}
            <Button asChild className="mt-2 rounded-full bg-white text-gray-900 hover:bg-white/90">
              <Link to="/explain" onClick={() => setOpen(false)}>
                Try the explainer
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
