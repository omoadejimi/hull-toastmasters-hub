# Hull Speakers

Accessible public website for Hull Speakers, a Toastmasters club in Hull. It includes meeting information, a generated calendar and email draft helpers for guest visits and enquiries.

## Club information

The owner confirmed these details on 6 November 2026:

- **Club:** Hull Speakers
- **Venue:** Holiday Inn Express, 80 Ferensway, Hull HU2 8LN
- **Email:** contact@hullspeakers.org
- **Regular schedule in the existing club data:** second and fourth Tuesdays, 7–9pm, UK local time. Confirm cancellations and special arrangements with the club.

Maintain club information and meeting overrides in `src/data/club.ts`. See [calendar maintenance](docs/updating-the-calendar.md).

## Development

Use Node.js 22.12 or later (Node 24 is supported) and npm. This project uses React, TypeScript, TanStack Start, Vite, Tailwind CSS and Nitro.

```sh
npm ci
npm run dev
```

The committed npm lockfile pins resolved dependencies. `.npmrc` disables automatic peer installation to avoid installing optional framework/devtools integrations that this application does not use. Core framework versions include targeted security patches. A scoped minimatch override addresses a development-tool advisory; recheck it when upgrading TypeScript ESLint.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

For browser and automated accessibility checks, install Chromium with `npx playwright install chromium`, start the production server with `npm start`, then run `npm run test:a11y` in another terminal. `BASE_URL` overrides the default `http://127.0.0.1:3000`. These checks complement manual keyboard and screen reader testing; they do not certify WCAG conformance.

## Hosting on Vercel

Import the GitHub repository into Vercel with `main` as the production branch and the repository root as the project directory. Use the TanStack Start preset, the default build settings and Node.js 24.x. Nitro builds the server function and static assets for Vercel. To verify the Vercel output locally, run `NITRO_PRESET=vercel npm run build` and check `.vercel/output/`.

Set `VITE_SITE_URL` to the final public HTTPS origin in Vercel's Production environment before building to enable absolute canonical and sharing URLs. The sitemap uses the request origin.

## Local production build

```sh
npm run build
npm start
```

Nitro produces `.output/public` and `.output/server/index.mjs` for a local Node build. The server reads `PORT` (default 3000). The custom SSR entry, HTML error page, route boundaries and server-function CSRF protection are retained.

Only variables prefixed `VITE_` are exposed to the browser by Vite. Never put secrets in them. No API keys are required for the current site.

## Email and privacy

The forms validate locally and prepare an email draft. They do not submit to a backend, reserve a place or confirm delivery. The visitor must open an email app or copy the draft into their email service, review it and send it. Values are retained on the page; they are not stored in browser storage. Test the real mailbox and response process before advertising guaranteed contact or bookings.

There are no embedded maps, analytics or remote font requests in the app. The optional map link opens an external service only when selected. Hosting infrastructure may keep normal access logs; review its privacy settings separately.

## Brand and assets

The unmodified Toastmasters International logo in `public/toastmasters-logo.png` was retrieved from [Toastmasters' official asset CDN](https://ccdn.toastmasters.org/medias/images/global/toastmasterslogo2x.png). It replaces an asset URL that depended on the previous host. Toastmasters trademarks and copyright notices remain in the footer. The existing hero photograph and favicon are retained. Montserrat Bold is hosted locally for headings, with its SIL Open Font License in `public/fonts/OFL.txt`; Arial provides the permitted system font for body copy. The exact primary palette, approved blue gradient and 72px minimum logo width follow the August 2026 brand manual.

Consult the [official brand manual](https://content.toastmasters.org/image/upload/02330-001-0001-brand-manual.pdf) and [governing documents](https://www.toastmasters.org/GovDocs) before changing authorised logo artwork, colours or trademark notices.

## Review status

See [audit and validation](docs/audit.md) for the accessibility changes, evidence and outstanding manual checks.
