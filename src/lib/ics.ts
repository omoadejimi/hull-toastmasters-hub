import type { Meeting } from "@/data/club";

const TZID = "Europe/London";

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
    .replace(/\r?\n/g, "\\n");
}

/** RFC 5545 requires lines of 75 octets or fewer. */
function fold(line: string) {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);
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
    `PRODID:-//${options.calendarName}//Club Calendar//EN`,
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