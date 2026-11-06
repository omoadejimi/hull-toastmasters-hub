# Updating the club calendar

Club details and meetings live in `src/data/club.ts`. Changes update the website,
calendar event metadata and the iCal feed at `/calendar.ics`. Check the production
build before publishing a schedule change.

## Regular meetings

`SCHEDULE` generates the second and fourth Tuesday of each month, from the
current UK calendar day through the configured number of months ahead. Dates
are selected in `Europe/London`, regardless of the server or visitor's time zone.

```ts
export const SCHEDULE = {
  weekday: 2, // 0 = Sunday, 1 = Monday, 2 = Tuesday ...
  weeksOfMonth: [2, 4],
  start: "19:00", // UK local time; the feed handles GMT and BST
  end: "21:00",
  title: "Regular club meeting",
  theme: "Prepared speeches, Table Topics and evaluations",
  format: "In person", // "In person" | "Hybrid" | "Online"
  spaces: 12, // editorial estimate, not live availability
  monthsAhead: 8,
};
```

To move to the first and third Monday, set `weekday: 1` and
`weeksOfMonth: [1, 3]`. Confirm holiday and venue exceptions before publishing.
The calendar keeps today's meeting listed until midnight UK time.

## Change or cancel a date

Add an entry to `MEETING_OVERRIDES`, keyed by `YYYY-MM-DD`. Omit title and theme
when they should keep the regular defaults; do not set them to empty strings.

```ts
export const MEETING_OVERRIDES = {
  "2026-12-22": { cancelled: true },
  "2027-01-12": { title: "Contest heats", end: "21:15" },
};
```

Cancellation removes a meeting from the website and feed. Calendar apps control
refresh intervals and may retain removed events. Confirm significant changes
with attendees directly; do not rely on a calendar subscription as the only
notification channel.

## Add a one-off event

Add a dated entry to `EXTRA_MEETINGS`. Use matching format and location details.
Only advertise a joining-link process that the club can fulfil.

```ts
export const EXTRA_MEETINGS = [
  {
    date: "2027-01-20",
    title: "Pathways workshop (online)",
    theme: "Choose your learning path",
    format: "Online",
    location: "Online — contact the club for joining details",
  },
];
```

## Club details

The `CLUB` object is the source for the name, contact address, venue and regular
meeting description. The club owner confirmed these details for this audit:

- Hull Speakers
- Holiday Inn Express, 80 Ferensway, Hull HU2 8LN
- contact@hullspeakers.org

The previous Hull Central Library address and alternative email were inconsistent
with these confirmed details. Keep every page and metadata entry aligned with
`CLUB` when details change. The contact and attendance forms prepare email drafts;
they do not submit to a booking or delivery service, and guest capacity is not
live inventory.

## Calendar feed and checks

- Subscribe using the production origin plus `/calendar.ics`, or the corresponding
  `webcal://` address.
- Downloading an `.ics` file imports a snapshot; it does not subscribe to updates.
- The feed uses `Europe/London`, CRLF line endings and UTF-8-safe line folding.
- Machine-readable event timestamps include the UK offset for evening meetings.
- Calendar clients decide when to refresh. Test a subscription and downloaded
  import in the actual client apps used by members before claiming compatibility.
- Run `npm test`, `npm run typecheck` and `npm run build` after changes.
