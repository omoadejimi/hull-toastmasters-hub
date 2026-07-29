import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/toastmasters-logo.svg.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/meetings", label: "Meetings" },
  { to: "/calendar", label: "Calendar" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Hull Toastmasters home">
          <img
            src={logoAsset.url}
            alt="Toastmasters International"
            width={434}
            height={360}
            className="h-10 w-auto"
          />
          <span className="leading-tight">
            <span className="block text-base font-bold text-primary">Hull Toastmasters</span>
            <span className="block text-xs text-muted-foreground">Club 1234567 · District 91</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted [&.active]:bg-muted [&.active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link to="/meetings">Sign up for a meeting</Link>
          </Button>
        </nav>

        <Button
          variant="outline"
          size="icon"
          className="min-h-11 min-w-11 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="block rounded-md px-3 py-3 text-base font-semibold hover:bg-muted [&.active]:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}