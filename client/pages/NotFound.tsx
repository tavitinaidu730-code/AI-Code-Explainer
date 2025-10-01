import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-24 text-white sm:px-6">
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
        404 — Page not found
      </span>
      <h1 className="text-4xl font-semibold leading-tight">
        We couldn't find the page you were looking for.
      </h1>
      <p className="text-white/70">
        The URL {location.pathname} doesn't exist. Double-check the link or return home to keep exploring Linewise.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4" /> Back to homepage
      </Link>
    </div>
  );
};

export default NotFound;
