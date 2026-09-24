export const CLUB = {
  name: "Hull Speakers",
  tagline: "",
  email: "contact@hullspeakers.org",
  phone: "+44 1482 000 000",
  venue: "Holiday Inn Express, 80 Ferensway Hull, HU2 8LN,\u00a0 United Kingdom",
  when: "Every 2nd and 4th Tuesday at 7pm",
};

export type MeetingFormat = "In person" | "Hybrid" | "Online";

export interface Meeting {
  id: string;
  date: string; // ISO date, e.g. 2026-08-11
  title: string;
  start: string; // 24h local time, e.g. "19:00"
  end: string; // 24h local time, e.g. "21:00"
  time: string; // human readable, derived from start/end
  theme: string;
  format: MeetingFormat;
  spaces: number;
  location: string;
}

/* ---------------------------------------------------------------------------
 * CLUB CALENDAR — the only two blocks you normally need to edit.
 *
 * 1. SCHEDULE below generates every regular meeting automatically, forever.
 *    Past meetings drop off the site on their own, so the calendar never
 *    goes stale.
 * 2. MEETING_OVERRIDES lets you customise or cancel a single date.
 * ------------------------------------------------------------------------ */

export const SCHEDULE = {
  /** 0 = Sunday, 1 = Monday, 2 = Tuesday … */
  weekday: 2,
  /** Which occurrences of that weekday each month (2nd and 4th). */
  weeksOfMonth: [2, 4],
  start: "19:00",
  end: "21:00",
  title: "Regular club meeting",
  theme: "Prepared speeches, Table Topics and evaluations",
  format: "In person" as MeetingFormat,
  /** Guest places advertised for a normal meeting. */
  spaces: 12,
  /** How many months of future meetings to publish. */
  monthsAhead: 8,
};

/**
 * Change one meeting: add an entry keyed by its ISO date.
 * Set `cancelled: true` to remove that date from the calendar entirely.
 */
export const MEETING_OVERRIDES: Record<
  string,
  Partial<Omit<Meeting, "id" | "date" | "time">> & { cancelled?: boolean }
> = {
  "2026-09-22": {
    title: "Humorous speech contest heats",
    theme: "Make them laugh, make them listen",
    end: "21:15",
    spaces: 5,
  },
  "2026-10-13": {
    title: "",
    theme: "",
    start: "18:45",
    spaces: 20,
  },
};

/** Extra one-off events that are not part of the regular schedule. */
export const EXTRA_MEETINGS: Array<
  Partial<Omit<Meeting, "id" | "time">> & { date: string }
> = [
  {
    date: "2026-11-04",
    title: "Pathways workshop (online)",
    theme: "Choose your learning path",
    format: "In person",
    spaces: 30,
    location: "Online — joining link sent on registration",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Nth occurrence (1-based) of a weekday in a given month, or null. */
function nthWeekday(year: number, month: number, weekday: number, nth: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return day > daysInMonth ? null : isoDate(year, month, day);
}

export function formatTimeRange(start: string, end: string) {
  const to12h = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${pad(m)}${suffix}`;
  };
  return `${to12h(start)} – ${to12h(end)}`;
}

/**
 * Upcoming meetings, generated from SCHEDULE and merged with overrides.
 * Called lazily so it always reflects "today".
 */
export function getMeetings(from: Date = new Date()): Meeting[] {
  const today = isoDate(from.getFullYear(), from.getMonth(), from.getDate());
  const dates = new Set<string>();

  for (let i = 0; i <= SCHEDULE.monthsAhead; i++) {
    const cursor = new Date(from.getFullYear(), from.getMonth() + i, 1);
    for (const nth of SCHEDULE.weeksOfMonth) {
      const date = nthWeekday(cursor.getFullYear(), cursor.getMonth(), SCHEDULE.weekday, nth);
      if (date) dates.add(date);
    }
  }
  for (const extra of EXTRA_MEETINGS) dates.add(extra.date);

  return [...dates]
    .filter((date) => date >= today)
    .sort()
    .map((date) => {
      const extra = EXTRA_MEETINGS.find((e) => e.date === date) ?? {};
      const override = MEETING_OVERRIDES[date] ?? {};
      if (override.cancelled) return null;
      const merged = {
        title: SCHEDULE.title,
        theme: SCHEDULE.theme,
        start: SCHEDULE.start,
        end: SCHEDULE.end,
        format: SCHEDULE.format,
        spaces: SCHEDULE.spaces,
        location: CLUB.venue,
        ...extra,
        ...override,
      };
      return {
        id: date,
        date,
        time: formatTimeRange(merged.start, merged.end),
        ...merged,
      } as Meeting;
    })
    .filter((m): m is Meeting => m !== null);
}
