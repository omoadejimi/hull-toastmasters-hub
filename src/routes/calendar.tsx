import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CLUB, MEETINGS } from "@/data/club";

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
    links: [{ rel: "canonical", href: "/calendar" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          MEETINGS.map((m) => ({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${m.title} — Hull Toastmasters`,
            startDate: m.date,
            eventAttendanceMode:
              m.format === "Online"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: CLUB.venue, address: CLUB.venue },
            description: m.theme,
            organizer: { "@type": "Organization", name: CLUB.name },
          })),
        ),
      },
    ],
  }),
});

function CalendarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Club calendar</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        {CLUB.when}. We meet at {CLUB.venue}. Guests are welcome at every meeting.
      </p>

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
            {MEETINGS.map((m) => (
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