import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, MessageSquare, Users } from "lucide-react";
import heroImage from "@/assets/hero-speaking.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLUB, MEETINGS, POSTS } from "@/data/club";

const TITLE = "Hull Toastmasters | Friendly Public Speaking Club in Hull";
const DESCRIPTION =
  "Grow your confidence in public speaking and leadership with Hull Toastmasters. Meetings twice a month at Hull Central Library — guests always welcome.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
    text: "The Toastmasters Pathways programme lets you choose a learning path and progress project by project.",
  },
];

function Index() {
  const nextMeetings = MEETINGS.slice(0, 3);
  const latestPosts = POSTS.slice(0, 2);

  return (
    <>
      <section className="hero-surface text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {CLUB.tagline}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Become the speaker and leader you want to be
            </h1>
            <p className="mt-4 max-w-prose text-base opacity-90 md:text-lg">
              Hull Toastmasters is a welcoming club where people practise public speaking, run
              meetings and give each other honest, encouraging feedback. No experience needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/meetings">Sign up for a meeting</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/calendar">See the club calendar</Link>
              </Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm opacity-90">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {CLUB.venue}
            </p>
          </div>
          <img
            src={heroImage}
            width={1600}
            height={1000}
            alt="Hull Toastmasters member giving a speech at a lectern while club members listen"
            className="w-full rounded-xl object-cover card-elevated"
          />
        </div>
      </section>

      <section aria-labelledby="benefits" className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="benefits" className="text-2xl font-bold md:text-3xl">
          What you get from a club evening
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="card-elevated">
              <CardHeader>
                <Icon aria-hidden="true" className="size-6 text-secondary" />
                <CardTitle className="text-lg">{title}</CardTitle>
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
              Next meetings
            </h2>
            <Link to="/calendar" className="text-sm font-semibold text-primary hover:underline">
              View full calendar
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {nextMeetings.map((m) => (
              <li key={m.id}>
                <Card className="h-full card-elevated">
                  <CardHeader>
                    <p className="text-sm font-semibold text-secondary">
                      <time dateTime={m.date}>
                        {new Date(m.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </time>
                    </p>
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{m.theme}</p>
                    <p>
                      {m.time} · {m.format}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="latest-posts" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-posts" className="text-2xl font-bold md:text-3xl">
            From the club blog
          </h2>
          <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
            Read all posts
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {latestPosts.map((p) => (
            <li key={p.slug}>
              <Card className="h-full card-elevated">
                <CardHeader>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    <time dateTime={p.date}>
                      {new Date(p.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>{" "}
                    · {p.readingTime}
                  </p>
                  <CardTitle className="text-lg">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="hover:text-primary hover:underline"
                    >
                      {p.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.excerpt}</CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
