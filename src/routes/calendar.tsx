import { canonicalLinks, socialMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLUB, formatMeetingDate, getMeetings, meetingDateTime } from "@/data/club";

const TITLE = `Club calendar | ${CLUB.name}`;
const DESCRIPTION = `See upcoming ${CLUB.name} meetings, with dates, UK times, themes and locations. Guests are welcome to ask about attending.`;

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      ...socialMeta("/calendar"),
    ],
    links: [
      ...canonicalLinks("/calendar"),
      {
        rel: "alternate",
        type: "text/calendar",
        href: "/calendar.ics",
        title: `${CLUB.name} meetings`,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getMeetings().map((meeting) => ({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${meeting.title} — ${CLUB.name}`,
            startDate: meetingDateTime(meeting.date, meeting.start),
            endDate: meetingDateTime(meeting.date, meeting.end),
            eventAttendanceMode:
              meeting.format === "Online"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : meeting.format === "Hybrid"
                  ? "https://schema.org/MixedEventAttendanceMode"
                  : "https://schema.org/OfflineEventAttendanceMode",
            ...(meeting.format !== "Online" && {
              location: { "@type": "Place", name: meeting.location, address: meeting.location },
            }),
            description: meeting.theme,
            organizer: { "@type": "Organization", name: CLUB.name, email: CLUB.email },
          })),
        ),
      },
    ],
  }),
});

function CalendarPage() {
  const meetings = useMemo(() => getMeetings(), []);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const feedUrl = `${origin}/calendar.ics`;
  const webcalUrl = origin ? feedUrl.replace(/^https?:/, "webcal:") : "";
  const googleUrl = origin
    ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`
    : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Club calendar</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        {CLUB.when}. We meet at {CLUB.venue}. Guests are welcome. All times are UK local time (GMT
        or BST).
      </p>

      <section
        aria-labelledby="subscribe"
        className="mt-8 rounded-lg border border-border bg-surface p-5"
      >
        <h2 id="subscribe" className="text-lg font-bold">
          Add meetings to your calendar
        </h2>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Subscribe in Apple Calendar, Outlook, Google Calendar or another app that supports iCal.
          Your app checks for updates periodically. A downloaded file is a one-time copy and will
          not update automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-center">
            <a href={webcalUrl || "/calendar.ics"}>
              <CalendarPlus aria-hidden="true" />
              Subscribe in your calendar app
            </a>
          </Button>
          {googleUrl ? (
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-center"
            >
              <a href={googleUrl} target="_blank" rel="noreferrer">
                Add to Google Calendar (opens a new tab)
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            variant="outline"
            className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-center"
          >
            <a href="/calendar.ics" download="hull-speakers.ics">
              <Download aria-hidden="true" />
              Download .ics file
            </a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          If your calendar app does not open, copy this feed address into its subscription settings:{" "}
          <a
            href="/calendar.ics"
            className="break-all font-medium text-primary underline underline-offset-4"
          >
            {feedUrl}
          </a>
        </p>
      </section>

      <section aria-labelledby="upcoming-meetings" className="mt-10">
        <h2 id="upcoming-meetings" className="text-2xl font-bold">
          Upcoming meetings
        </h2>
        {meetings.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {meetings.map((meeting) => (
              <li key={meeting.id} className="min-w-0 rounded-lg border border-border p-5">
                <p className="font-semibold text-primary">
                  <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
                </p>
                <h3 className="mt-2 text-lg font-bold">{meeting.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{meeting.theme}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold">Time (UK)</dt>
                    <dd>{meeting.time}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Format</dt>
                    <dd>{meeting.format}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Location</dt>
                    <dd>{meeting.location}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-muted-foreground">
            No meetings are listed yet. Contact us for the next meeting date.
          </p>
        )}
      </section>

      <div className="mt-8">
        <Button
          asChild
          size="lg"
          className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-center"
        >
          <Link to="/meetings">Ask to attend a meeting</Link>
        </Button>
      </div>
    </div>
  );
}
