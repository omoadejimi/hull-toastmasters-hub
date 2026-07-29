# Updating the club calendar

Everything lives in one file: `src/data/club.ts`. Edit it, save, and the
website, the JSON-LD event data for Google, and the iCal feed at
`/calendar.ics` all update together.

## 1. Regular meetings happen automatically

The `SCHEDULE` block generates every regular meeting, so you never have to add
dates by hand and old meetings disappear on their own.

```ts
export const SCHEDULE = {
  weekday: 2,          // 0 = Sunday, 1 = Monday, 2 = Tuesday ...
  weeksOfMonth: [2, 4],// 2nd and 4th Tuesday of each month
  start: "19:00",      // 24-hour clock
  end: "21:00",
  title: "Regular club meeting",
  theme: "Prepared speeches, Table Topics and evaluations",
  format: "In person", // "In person" | "Hybrid" | "Online"
  spaces: 12,          // guest places advertised
  monthsAhead: 8,      // how far ahead to publish
};
```

Moved to the 1st and 3rd Monday? Set `weekday: 1` and `weeksOfMonth: [1, 3]`.

## 2. Change or cancel a single date

Add an entry to `MEETING_OVERRIDES`, keyed by the date (`YYYY-MM-DD`):

```ts
export const MEETING_OVERRIDES = {
  "2026-12-22": { cancelled: true },                       // no meeting
  "2026-09-22": { title: "Contest heats", spaces: 5 },     // special evening
};
```

## 3. Add a one-off event

Add it to `EXTRA_MEETINGS`:

```ts
export const EXTRA_MEETINGS = [
  {
    date: "2026-11-04",
    title: "Pathways workshop (online)",
    theme: "Choose your learning path",
    format: "Online",
    spaces: 30,
    location: "Online — joining link sent on registration",
  },
];
```

## 4. Club details

Name, email, venue and the "when" sentence shown in the header, footer and
calendar feed are in the `CLUB` object at the top of the same file.

## The iCal feed

- Feed URL: `https://your-domain/calendar.ics`
- Subscribe URL (one-click in Apple Calendar / Outlook): `webcal://your-domain/calendar.ics`
- Calendar apps re-check roughly every 12 hours, so anything you change here
  reaches subscribers without them doing anything.