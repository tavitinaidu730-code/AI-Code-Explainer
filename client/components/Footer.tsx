import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

const footerLinks: { label: string; href: string; isRoute?: boolean }[] = [
  { label: "Features", href: "/#features" },
  { label: "Explain", href: "/explain", isRoute: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[rgba(8,12,28,0.8)] text-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link to="/" className="text-lg font-semibold text-white">
            Linewise
          </Link>
          <p className="max-w-sm text-sm text-white/60">
            Understand any JavaScript or React snippet line by line with an AI companion built for clarity.
          </p>
        </div>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
          <nav className="flex flex-wrap gap-4 text-sm text-white/60">
            {footerLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
          <div className="flex items-center gap-4 text-white/60">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-white"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
