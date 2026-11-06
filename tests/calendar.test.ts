import assert from "node:assert/strict";
import test from "node:test";
import {
  CLUB,
  formatMeetingDate,
  getMeetings,
  MEETING_OVERRIDES,
  meetingDateTime,
  type Meeting,
} from "../src/data/club.ts";
import { buildIcs } from "../src/lib/ics.ts";

test("regular meetings continue on the second and fourth Tuesdays across a year boundary", () => {
  const meetings = getMeetings(new Date("2026-12-30T12:00:00Z"));
  assert.deepEqual(
    meetings.slice(0, 2).map((meeting) => meeting.date),
    ["2027-01-12", "2027-01-26"],
  );
  assert.ok(meetings.every((meeting) => meeting.location === CLUB.venue));
});

test("the UK calendar day determines when a past meeting disappears in summer", () => {
  assert.ok(
    getMeetings(new Date("2026-06-23T22:30:00Z")).some((meeting) => meeting.date === "2026-06-23"),
  );
  assert.ok(
    !getMeetings(new Date("2026-06-23T23:30:00Z")).some((meeting) => meeting.date === "2026-06-23"),
  );
});

test("a cancelled meeting is excluded and an override updates its end time", () => {
  MEETING_OVERRIDES["2026-11-10"] = { cancelled: true };
  try {
    assert.ok(
      !getMeetings(new Date("2026-11-01T12:00:00Z")).some(
        (meeting) => meeting.date === "2026-11-10",
      ),
    );
  } finally {
    delete MEETING_OVERRIDES["2026-11-10"];
  }
  const contest = getMeetings(new Date("2026-09-01T12:00:00Z")).find(
    (meeting) => meeting.date === "2026-09-22",
  );
  assert.equal(contest?.end, "21:15");
  assert.equal(contest?.time, "7:00pm – 9:15pm");
});

test("online extra events and regular fallback titles retain coherent content", () => {
  const meetings = getMeetings(new Date("2026-10-01T12:00:00Z"));
  const workshop = meetings.find((meeting) => meeting.date === "2026-11-04");
  assert.equal(workshop?.format, "Online");
  assert.match(workshop?.location ?? "", /Online/);
  assert.ok(meetings.every((meeting) => meeting.title.trim().length > 0));
});

test("date labels remain on the advertised calendar day in western time zones", () => {
  const original = process.env.TZ;
  process.env.TZ = "America/Los_Angeles";
  try {
    assert.match(formatMeetingDate("2026-11-10"), /Tuesday, 10 November 2026/);
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("machine-readable evening meeting times use GMT in winter and BST in summer", () => {
  assert.equal(meetingDateTime("2026-11-10", "19:00"), "2026-11-10T19:00:00+00:00");
  assert.equal(meetingDateTime("2027-06-08", "19:00"), "2027-06-08T19:00:00+01:00");
});

test("iCal preserves UK meeting times and escapes text with UTF-8-safe line folding", () => {
  const meeting: Meeting = {
    id: "2027-06-08",
    date: "2027-06-08",
    title: "Speaking, listening; learning",
    theme: `Feedback\\practice\n${"é 😀 ".repeat(35)}`,
    start: "19:00",
    end: "21:00",
    time: "7:00pm – 9:00pm",
    format: "In person",
    spaces: 12,
    location: CLUB.venue,
  };
  const ics = buildIcs({
    meetings: [meeting],
    calendarName: CLUB.name,
    description: "Club meetings",
    domain: "example.org",
    siteUrl: "https://example.org",
  });
  assert.ok(ics.endsWith("\r\n"));
  assert.ok(ics.split("\r\n").every((line) => Buffer.byteLength(line, "utf8") <= 75));
  assert.ok(!ics.includes("�"));
  const unfolded = ics.replace(/\r\n /g, "");
  assert.match(unfolded, /DTSTART;TZID=Europe\/London:20270608T190000/);
  assert.match(unfolded, /DTEND;TZID=Europe\/London:20270608T210000/);
  assert.match(unfolded, /SUMMARY:Speaking\\, listening\\; learning/);
  assert.ok(unfolded.includes("Feedback\\\\practice\\n"));
  assert.ok(unfolded.includes("é 😀 ".repeat(35)));
  assert.match(unfolded, /UID:2027-06-08@example.org/);
});
