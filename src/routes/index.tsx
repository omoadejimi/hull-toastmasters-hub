import { canonicalLinks, socialMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, MessageSquare, Users } from "lucide-react";
import heroImage from "@/assets/hero-speaking.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CLUB, formatMeetingDate, getMeetings } from "@/data/club";

const TITLE = "Hull Speakers | Friendly Toastmasters Club in Hull";
const DESCRIPTION =
  "Build confidence in public speaking and leadership with Hull Speakers, a Toastmasters club in Hull. Guests are welcome at our twice-monthly meetings.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      ...socialMeta("/"),
    ],
    links: canonicalLinks("/"),
  }),
});

const BENEFITS = [
  {
    icon: MessageSquare,
    title: "Speak with confidence",
    text: "Prepared speeches and impromptu Table Topics give you regular, low-pressure practice in front of a supportive audience.",
  },
  {
    icon: Users,
    title: "Lead with clarity",
    text: "Every meeting is run by members. Take a role, chair an evening, or join the committee to build real leadership experience.",
  },
  {
    icon: CalendarDays,
    title: "Learn at your own pace",
    text: "Toastmasters' Pathways learning programme helps you develop communication and leadership skills through practical projects at your own pace.",
  },
];

function Index() {
  const nextMeetings = getMeetings().slice(0, 3);

  return (
    <>
      <section className="hero-surface text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              A Toastmasters club in Hull
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Speak and lead with confidence
            </h1>
            <div className="mt-4 max-w-prose text-base opacity-90 md:text-lg">
              <p>
                Hull Speakers is a welcoming club where people practise public speaking, run
                meetings and give each other honest and encouraging feedback. No experience needed.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-auto min-h-11 whitespace-normal text-center"
              >
                <Link to="/meetings">Join a meeting</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto min-h-11 whitespace-normal border-primary-foreground/70 bg-transparent text-center text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/calendar">View upcoming meetings</Link>
              </Button>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
              <span>
                {CLUB.when}.<br />
                {CLUB.venue}
              </span>
            </p>
            <p className="mt-3 text-sm">
              Email us before travelling to confirm your visit and any access needs.
            </p>
          </div>
          <img
            src={heroImage}
            width={1600}
            height={1000}
            alt="A speaker at a lectern with an audience seated around the room"
            fetchPriority="high"
            className="w-full rounded-xl object-cover card-elevated"
          />
        </div>
      </section>

      <section aria-labelledby="benefits" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="benefits" className="text-2xl font-bold md:text-3xl">
          What you'll get from joining our meetings
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="card-elevated">
              <CardHeader>
                <Icon aria-hidden="true" className="size-6 text-secondary" />
                <h3 className="text-lg font-semibold leading-snug">{title}</h3>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="next-meetings" className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="next-meetings" className="text-2xl font-bold md:text-3xl">
              Upcoming meetings
            </h2>
            <Link
              to="/calendar"
              className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-primary underline underline-offset-4 hover:no-underline"
            >
              View full calendar
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {nextMeetings.map((m) => (
              <li key={m.id}>
                <Card className="h-full card-elevated">
                  <CardHeader>
                    <p className="text-sm font-semibold text-secondary">
                      <time dateTime={m.date}>{formatMeetingDate(m.date)}</time>
                    </p>
                    <h3 className="text-lg font-semibold leading-snug">{m.title}</h3>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>{m.time} (UK time)</p>
                    <p>{m.format}</p>
                    <p>{m.location}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="first-visit" className="mx-auto max-w-6xl px-4 pt-16">
        <h2 id="first-visit" className="text-2xl font-bold md:text-3xl">
          Your first visit
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Let us know you're coming</h3>
            <p className="mt-2 text-muted-foreground">
              Choose a meeting and prepare an email to the club. Ask us to confirm the arrangements
              and answer your questions before you travel.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Meet a supportive group</h3>
            <p className="mt-2 text-muted-foreground">
              A typical meeting includes prepared speeches, short impromptu talks called Table
              Topics, and constructive feedback.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Take it at your own pace</h3>
            <p className="mt-2 text-muted-foreground">
              New to public speaking? Tell us if you'd prefer to observe first, or if there is
              anything we can do to help you take part.
            </p>
          </div>
        </div>
        <Button asChild className="mt-6 h-auto min-h-11 whitespace-normal text-center">
          <Link to="/meetings">Choose a meeting to visit</Link>
        </Button>
      </section>
    </>
  );
}
