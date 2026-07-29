import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLUB, getMeetings } from "@/data/club";

const TITLE = "Club Calendar | Hull Toastmasters";
const DESCRIPTION =
  "See every upcoming Hull Toastmasters meeting, contest and workshop, with dates, times, themes and whether the evening is in person, hybrid or online.";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/calendar" },
    ],
    links: [
      { rel: "canonical", href: "/calendar" },
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
          getMeetings().map((m) => ({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${m.title} — Hull Toastmasters`,
            startDate: m.date,
            eventAttendanceMode:
              m.format === "Online"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: m.location, address: m.location },
            description: m.theme,
            organizer: { "@type": "Organization", name: CLUB.name },
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
        {CLUB.when}. We meet at {CLUB.venue}. Guests are welcome at every meeting.
      </p>

      <section
        aria-labelledby="subscribe"
        className="mt-8 rounded-lg border border-border bg-surface p-5"
      >
        <h2 id="subscribe" className="text-lg font-bold">
          Subscribe to the calendar
        </h2>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Add our meetings to Apple Calendar, Outlook, Google Calendar or any app that supports
          iCal. Subscribing keeps your calendar up to date automatically whenever the club schedule
          changes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <a href={webcalUrl || "/calendar.ics"}>
              <CalendarPlus aria-hidden="true" />
              Subscribe in your calendar app
            </a>
          </Button>
          {googleUrl ? (
            <Button asChild variant="outline">
              <a href={googleUrl} target="_blank" rel="noreferrer">
                Add to Google Calendar
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <a href="/calendar.ics" download="hull-speakers.ics">
              <Download aria-hidden="true" />
              Download .ics file
            </a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Prefer to paste a link?{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {origin ? feedUrl : "/calendar.ics"}
          </code>
        </p>
      </section>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
          <caption className="sr-only">Upcoming Hull Toastmasters meetings</caption>
          <thead className="bg-surface">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">
                Date
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Meeting
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Time
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Format
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Guest places
              </th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.id} className="border-t border-border align-top">
                <th scope="row" className="px-4 py-4 font-semibold text-primary">
                  <time dateTime={m.date}>
                    {new Date(m.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </th>
                <td className="px-4 py-4">
                  <span className="block font-semibold">{m.title}</span>
                  <span className="text-muted-foreground">{m.theme}</span>
                </td>
                <td className="px-4 py-4">{m.time}</td>
                <td className="px-4 py-4">{m.format}</td>
                <td className="px-4 py-4">{m.spaces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Button asChild size="lg">
          <Link to="/meetings">Sign up for a meeting</Link>
        </Button>
      </div>
    </div>
  );
}