import { Link } from "@tanstack/react-router";
import { CLUB } from "@/data/club";
import logoAsset from "@/assets/toastmasters-logo.svg.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img
            src={logoAsset.url}
            alt="Toastmasters International"
            width={434}
            height={360}
            className="h-14 w-auto"
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
              <Link to="/meetings" className="hover:underline">
                Sign up for a meeting
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="hover:underline">
                Club calendar
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
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
              <a className="hover:underline" href={`mailto:${CLUB.email}`}>
                {CLUB.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {CLUB.name}. The names “Toastmasters International”,
          “Toastmasters” and the Toastmasters International emblem are trademarks of Toastmasters
          International and are used with permission. This site is maintained by the club and does
          not represent the views of Toastmasters International.
        </p>
      </div>
    </footer>
  );
}