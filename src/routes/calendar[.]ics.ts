import { createFileRoute } from "@tanstack/react-router";
import { CLUB, getMeetings } from "@/data/club";
import { buildIcs } from "@/lib/ics";

export const Route = createFileRoute("/calendar.ics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = buildIcs({
          meetings: getMeetings(),
          calendarName: CLUB.name,
          description: `Upcoming ${CLUB.name} meetings. ${CLUB.when}. Guests always welcome.`,
          domain: new URL(origin).hostname,
          siteUrl: origin,
        });

        return new Response(body, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'inline; filename="hull-speakers.ics"',
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});