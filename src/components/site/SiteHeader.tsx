import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLUB } from "@/data/club";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/meetings", label: "Meetings" },
  { to: "/calendar", label: "Calendar" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 rounded-md"
          aria-label={`${CLUB.name} home`}
        >
          <img
            src="/toastmasters-logo.png"
            alt="Toastmasters International"
            width={297}
            height={248}
            className="h-auto w-[72px] shrink-0"
          />
          <span className="min-w-0 leading-tight">
            <span className="block text-base font-bold text-primary">{CLUB.name}</span>
            <span className="block text-xs text-muted-foreground">A Toastmasters club in Hull</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ "aria-current": "page" }}
              className="inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted [&.active]:bg-muted [&.active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="ml-2 min-h-11">
            <Link to="/meetings">Ask to visit a meeting</Link>
          </Button>
        </nav>

        <Button
          ref={menuButton}
          variant="outline"
          size="icon"
          className="min-h-11 min-w-11 shrink-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`${open ? "" : "hidden "}max-h-[60dvh] overflow-y-auto border-t border-border lg:hidden`}
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ "aria-current": "page" }}
                className="block rounded-md px-3 py-3 text-base font-semibold hover:bg-muted [&.active]:bg-muted [&.active]:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
