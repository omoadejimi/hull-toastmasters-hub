# Hull Speakers audit and validation

Baseline: main at 96643cd. Source inspection completed before branch creation on 6 November 2026.

| Priority | Confirmed issue                                                                               | Affected files                                                             | Recommendation                                                                              |
| -------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| High     | Email-only forms imply submission/reservation, reset data, and lack associated/focused errors | contact.tsx, meetings.tsx                                                  | Explicit draft workflow, retain values, accessible validation and copy fallback             |
| High     | Logo exists only as host-specific asset reference                                             | SiteHeader.tsx, SiteFooter.tsx, assets JSON                                | Track an authorised logo locally                                                            |
| High     | Conflicting club name, venue, email; placeholder phone                                        | club.ts, root/home metadata, contact.tsx                                   | Use one data source, flag unresolved venue, remove placeholder and contradictory map/schema |
| High     | Build and browser error telemetry depend on editor package/hooks                              | vite.config.ts, package.json, lib/lovable-error-reporting.ts, \_\_root.tsx | Explicit maintained Vite/TanStack/Nitro plugins; preserve SSR error handling                |
| Medium   | Relative sitemap URLs, incomplete sharing metadata                                            | sitemap.xml, route heads                                                   | Absolute URLs from validated configuration/request origin; consistent page metadata         |
| Medium   | Low-contrast focus on white; incomplete reduced-motion policy and menu dismissal              | styles.css, SiteHeader.tsx                                                 | Visible contrast-safe focus, reduced motion, Escape/focus restoration                       |
| Medium   | Calendar uses viewer/server timezone and character-count ICS folding                          | club.ts, calendar.tsx, ics.ts                                              | Europe/London date basis; UTF-8 octet folding; regression tests                             |
| Medium   | Mobile table requires horizontal scrolling, omits useful meeting details                      | calendar.tsx                                                               | Responsive semantic meeting list with titles and locations                                  |
| Medium   | No clear first-visit expectations, hardcoded meeting title, styled div headings               | index.tsx                                                                  | Welcoming first-visit guidance, actual meeting data, semantic headings                      |
| Medium   | Promotional README/editor configuration and release-age exemptions                            | README.md, AGENTS.md, .lovable, bunfig.toml, bun.lock                      | Independent maintainer documentation and reproducible lockfile                              |

Automated/browser checks were pending at the initial source-only stage; completed results are recorded below. This audit does not certify WCAG conformance or email delivery. No deployed URL is supplied, so injected hosting watermark behavior remains unverified.

## Implemented resolutions

- **Critical dependency security:** patched TanStack Start and its matching router/plugin versions, Vite and Zod; updated TypeScript ESLint and scoped its minimatch override. The initial installation reported 14 advisories, including 5 critical and 2 high. A clean final `npm ci` reports **0 known vulnerabilities**. Review the override with future upgrades; do not use force-upgrade remediation blindly.
- **High accessibility and form integrity:** associated inline errors, linked/focused summaries, keyboard-operated native radio choices, retained values, explicit local draft review, copy/manual-copy fallbacks and no claim of delivery or reservation. The next four dates appear initially; later dates remain available. Selecting a later date keeps it visible when the list collapses.
- **High content accuracy:** the owner confirmed Hull Speakers, Holiday Inn Express, 80 Ferensway, Hull HU2 8LN and contact@hullspeakers.org on 6 November 2026. These replace conflicting library/alternative-email metadata. Removed the placeholder telephone number and incorrect map embed. The existing second/fourth-Tuesday schedule is retained; special arrangements still need normal club maintenance.
- **Medium navigation and presentation:** semantic headings/landmarks, current-page indication, Escape/menu focus restoration, route/skip-link focus, visible dual-colour outlines, stronger input boundaries, reduced motion, readable first-visit guidance, honest calls to action and responsive calendar cards.
- **Medium calendar correctness:** UK calendar-day calculations, deterministic English labels across Node/Chromium, GMT/BST metadata, UTF-8 octet-based ICS folding, escaped text, absolute sitemap URLs and useful subscription/download fallbacks. Corrected an online sample event's format and empty sample override titles.
- **Medium SEO/privacy:** one canonical per route when configured, absolute sharing metadata and a local preview image. Canonical/share origins require `VITE_SITE_URL`. Removed the embedded third-party map and remote font calls; outbound map/calendar links remain explicit user actions.

## Branding and independence

Replaced `@lovable.dev/vite-tanstack-config` with explicit standard Vite, TanStack Start, React, Tailwind and Nitro integration. Vite's native TypeScript path resolution replaces the alias helper. Preserved the custom server entry, route error boundary, SSR fallback and CSRF middleware. Standard `VITE_` exposure remains; secrets must never use that prefix.

Removed the browser error hook module and calls, `.lovable/project.json`, promotional README/AGENTS text and obsolete Bun configuration/lockfile. npm and `package-lock.json` now provide a reproducible independent install. Existing legal requirements and the instruction against rewriting published Git history remain in maintainer guidance.

Replaced the host-only `/__l5e/assets-v1/...` logo reference with unchanged artwork from Toastmasters' official CDN. The logo is at least 72px wide; the exact primary palette, an approved Loyal Blue gradient, local Montserrat headings and Arial body copy follow the [August 2026 official brand manual](https://content.toastmasters.org/image/upload/02330-001-0001-brand-manual.pdf). The local font retains its SIL Open Font License. Toastmasters trademark/copyright attribution remains in the footer; no artwork was redrawn.

Source and generated production output were searched case-insensitively for editor branding, asset proxy paths and stale venue/email references. No runtime source/build matches remain; this audit necessarily names the removed vendor for provenance. No application-rendered watermark component was found. A published URL and hosting account were not supplied, so hosting-injected badges and their contractual settings **cannot be verified or changed through this PR**. Do not use CSS/DOM workarounds to conceal a platform-required badge. The independent build can be reviewed for a later hosting decision.

## Verification

Validation uses Node 24, a standard Nitro Node production build, Chromium 141 and axe-core 4.11.0. The test origin for canonical/share checks is `http://localhost:3000`; it is not an asserted production domain.

- Clean `npm ci`: passed, 0 known vulnerabilities. npm reports existing ESLint 9/Recharts 2 deprecations and local install-script approval notices; these do not prevent the verified build.
- `npm run typecheck`: passed.
- `npm run lint`: passed with 0 errors and 6 warnings. Six pre-existing Fast Refresh export warnings remain in reusable UI files; no rule was disabled to conceal a finding.
- `npm test`: seven calendar tests cover nth-weekday/year rollover, cancellations and overrides, UK midnight/BST, deterministic labels, offsets and Unicode-safe ICS output.
- `npm run build`: passed. The bundler emits dependency `use client` directive warnings and a Nitro code-splitting diagnostic; production SSR and hydration are tested separately.
- `npm run test:a11y`: **63/63 checks passed; 26 axe scans, 0 violations, 0 browser runtime errors**. The report retains 11 incomplete colour-contrast results for manual review (gradient backgrounds and partially clipped draft textareas); automated success is not used to dismiss these. The suite covers four routes at 320, 768 and 1440px, keyboard skip/navigation/menu behavior, reduced motion, invalid-form errors, native radio selection, draft preparation and clipboard success/failure fallbacks. It never sends email or opens an email client.
- Production HTTP checks: all four pages return 200; missing route returns 404 with one main landmark; configured canonicals appear once per page; sitemap has four absolute locations; calendar returns 18 events with `Europe/London`, CRLF and the confirmed venue; logo, font, preview image and robots file return 200.
- Visual review: all 12 page/viewport screenshots were inspected for readability, clipping, overlap and controls. The long visit-date list was shortened following this review.
- Contrast review for the gradient (which axe cannot resolve automatically): white against Loyal Blue **10.80:1**, white against the lighter endpoint **6.77:1**, Happy Yellow against the lighter endpoint **5.03:1**. At 90% white opacity, the hero paragraph remains approximately 5.7:1 against the lighter endpoint. Logo colours are trademark artwork.

Earlier checks found and prompted fixes for the mobile error target sizes and Node/Chromium date punctuation hydration mismatch. Dependency alignment initially failed a build and was corrected; the final results supersede it. An intermediate browser run was invalidated by a concurrent clean reinstall and was rerun after installation finished.

## Remaining manual checks and limits

This is a tested improvement toward WCAG 2.2 AA, **not a full conformance certification**. Automated rules cannot establish all success criteria. Before deployment, complete screen-reader checks with VoiceOver/NVDA, real iOS/Android and Safari/Firefox checks, browser text zoom/text-spacing/forced-colours checks, and visual focus/reading order review of all states. A 320px layout was tested for reflow; operating-system zoom modes were not exhaustively exercised.

The actual mailbox delivery and response process, operating-system mail handlers, and Apple/Outlook/Google subscription/import refresh behavior remain unverified. The site explicitly describes these limits. Do not advertise confirmed bookings or a delivered message from these forms. With JavaScript disabled, direct email links remain available; the interactive draft helper requires JavaScript.

No deployed site, hosting configuration, production sitemap discovery or live social-card crawler was tested. Set the real public origin, validate the intended Nitro/provider target and any host-injected branding, and review the host's access-log/privacy policy before deployment. Only the Node target was executed; the prior wrapper's implicit Cloudflare target is no longer assumed. No merge or deployment was performed.

Core Web Vitals require production field data; no LCP/INP/CLS pass is claimed. Hero image dimensions are specified and its existing 151KB file is retained. Route splitting and local assets are preserved; future performance work can subset/compress the local font and examine the main bundle without changing the current architecture.

Dependency audit results are point-in-time. Recheck advisories, the scoped minimatch override, and deprecated development/chart packages during maintenance. The existing hero image and favicon are retained; their original licensing/provenance should be confirmed by the owner if they are not already documented externally.

## Publication status

Published on `improvement/accessibility-ux-branding` as [draft pull request #1](https://github.com/omoadejimi/hull-toastmasters-hub/pull/1), targeting `main`. The four prepared implementation/audit commits were uploaded through the GitHub connection after write access was enabled; each uploaded Git tree matched its tested local counterpart. This publication record is a separate documentation update. Validation results above are local checks. Nothing was merged or deployed.
