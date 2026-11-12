# Maintainer guidance

- Preserve TanStack Start routing, server rendering, error boundaries and CSRF protection.
- Keep club details and the generated calendar in `src/data/club.ts`.
- Use semantic HTML, associated form errors, visible focus and reduced-motion support.
- Forms prepare email drafts; never claim delivery or a booking without a verified backend.
- Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Run `npm run test:a11y` against a running production server for browser regression checks.
- Do not rewrite published Git history. Use reviewable commits and a draft pull request.
- Do not merge or deploy without the owner's explicit approval.
- Preserve Toastmasters trademarks, authorised logo artwork and third-party licence notices.
- Keep Nitro's default output paths so Vercel builds its server function and static assets.
