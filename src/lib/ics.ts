import { CLUB_TIME_ZONE, type Meeting } from "@/data/club";

const TZID = CLUB_TIME_ZONE;

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0000",
  "TZOFFSETTO:+0100",
  "TZNAME:BST",
  "DTSTART:19700329T010000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0000",
  "TZNAME:GMT",
  "DTSTART:19701025T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n?|\n/g, "\\n");
}

/** RFC 5545: fold at 75 UTF-8 octets without splitting a code point. */
function fold(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      parts.push(current);
      current = " ";
      bytes = 1;
    }
    current += character;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n");
}

function localStamp(date: string, time: string) {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function utcStamp(d: Date) {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function buildIcs(options: {
  meetings: Meeting[];
  calendarName: string;
  description: string;
  domain: string;
  siteUrl: string;
}) {
  const now = utcStamp(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeText(options.calendarName)}//Club Calendar//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(options.calendarName)}`,
    `X-WR-CALDESC:${escapeText(options.description)}`,
    `X-WR-TIMEZONE:${TZID}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    ...VTIMEZONE,
  ];

  for (const meeting of options.meetings) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${meeting.id}@${options.domain}`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${TZID}:${localStamp(meeting.date, meeting.start)}`,
      `DTEND;TZID=${TZID}:${localStamp(meeting.date, meeting.end)}`,
      `SUMMARY:${escapeText(`${meeting.title} — ${options.calendarName}`)}`,
      `DESCRIPTION:${escapeText(
        `${meeting.theme}\n${meeting.format} meeting. Guests welcome.\n${options.siteUrl}/meetings`,
      )}`,
      `LOCATION:${escapeText(meeting.location)}`,
      `URL:${options.siteUrl}/calendar`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
