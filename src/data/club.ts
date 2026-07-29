export const CLUB = {
  name: "Hull Speakers",
  tagline: "",
  email: "contact@hullspeakers.org",
  phone: "+44 1482 000 000",
  venue: "Holiday Inn Express, 80 Ferensway Hull, HU2 8LN,\u00a0 United Kingdom",
  when: "Every 2nd and 4th Tuesday, 7:00 pm to 9:00 pm",
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
    title: "Open evening for guests",
    theme: "Bring a friend, try Table Topics",
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
    format: "Online",
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

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  readingTime: string;
  body: string[];
}

export const POSTS: Post[] = [
  {
    slug: "first-visit-what-to-expect",
    title: "Your first visit to Hull Speakers: what to expect",
    date: "2026-07-14",
    author: "Priya Nair",
    readingTime: "4 min read",
    excerpt:
      "Nervous about walking through the door? Here is exactly how a club evening runs, from the welcome desk to the closing round of applause.",
    body: [
      "Guests are welcome at every Hull Speakers meeting, and you never have to speak on your first night. A member meets you at the door, introduces you to a few people and finds you a seat with a good view of the lectern.",
      "A meeting has three parts. Prepared speeches come first: members deliver projects from the Toastmasters Pathways learning programme, usually five to seven minutes each. Table Topics follows, a fast round of one-to-two minute impromptu answers. Finally, evaluators give warm, specific feedback on everything they heard.",
      "The evening ends around 9pm and most of us head for a drink nearby. Bring nothing but curiosity — and if you would like to try Table Topics, just tell the Topicsmaster before we start.",
    ],
  },
  {
    slug: "beating-speaking-nerves",
    title: "Five practical ways to steady your speaking nerves",
    date: "2026-06-23",
    author: "Daniel Okafor",
    readingTime: "5 min read",
    excerpt:
      "Nerves never disappear completely — and they should not. Here is how our members turn adrenaline into energy the audience can feel.",
    body: [
      "Rehearse out loud, standing up, at least three times. Reading silently trains your eyes, not your voice.",
      "Arrive early and speak to people before you speak at people. A room of acquaintances is far easier than a room of strangers.",
      "Breathe low and slow for one minute before you stand. Four counts in, six counts out, repeated ten times, measurably lowers heart rate.",
      "Anchor your first thirty seconds word for word. Once the opening lands, the rest tends to follow.",
      "Book yourself in again quickly. Confidence compounds when the gap between speeches is short.",
    ],
  },
  {
    slug: "pathways-explained",
    title: "Toastmasters Pathways, explained simply",
    date: "2026-05-30",
    author: "Committee",
    readingTime: "3 min read",
    excerpt:
      "Eleven learning paths, one flexible programme. Here is how members at our Hull Speakers club choose where to start.",
    body: [
      "Pathways is the Toastmasters education programme. You pick a path — such as Dynamic Leadership or Presentation Mastery — and work through projects at your own pace.",
      "Each project pairs a short online module with a live speech at a club meeting, so learning is always tested in front of a real audience.",
      "New members complete an assessment that suggests a path, but the choice is always yours, and you can add further paths later.",
    ],
  },
];
