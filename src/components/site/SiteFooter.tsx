import { Link } from "@tanstack/react-router";
import { CLUB } from "@/data/club";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img
            src="/toastmasters-logo.png"
            alt="Toastmasters International"
            width={297}
            height={248}
            className="h-auto w-24"
          />
          <h2 className="mt-3 text-lg font-bold text-primary">{CLUB.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A member club of Toastmasters International, helping people in Hull and East Yorkshire
            become confident speakers and leaders.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/meetings"
                className="inline-flex min-h-11 items-center rounded-sm py-2 underline underline-offset-4 hover:no-underline"
              >
                Ask to visit a meeting
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="inline-flex min-h-11 items-center rounded-sm py-2 underline underline-offset-4 hover:no-underline"
              >
                Club calendar
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center rounded-sm py-2 underline underline-offset-4 hover:no-underline"
              >
                Contact the club
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Find us</h2>
          <address className="mt-3 space-y-2 text-sm not-italic text-muted-foreground">
            <p>{CLUB.venue}</p>
            <p>{CLUB.when}</p>
            <p>
              <a
                className="inline-flex min-h-11 items-center rounded-sm py-2 underline underline-offset-4 hover:no-underline"
                href={`mailto:${CLUB.email}`}
              >
                {CLUB.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {CLUB.name}. Toastmasters International® owns all
          Toastmasters trademarks and copyrights, including “Toastmaster”, “Toastmasters”,
          “Toastmasters International” and the “official emblem”. This site is maintained by the
          club and does not represent the views of Toastmasters International.
        </p>
      </div>
    </footer>
  );
}
