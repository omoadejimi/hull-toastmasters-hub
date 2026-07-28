import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLUB, MEETINGS } from "@/data/club";

const TITLE = "Sign Up for a Meeting | Hull Toastmasters";
const DESCRIPTION =
  "Reserve a guest place at an upcoming Hull Toastmasters meeting. Free to attend, no experience needed, and you never have to speak on your first visit.";

export const Route = createFileRoute("/meetings")({
  component: MeetingsPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/meetings" },
    ],
    links: [{ rel: "canonical", href: "/meetings" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  meeting: z.string().min(1, "Please choose a meeting"),
  notes: z.string().trim().max(1000).optional(),
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MeetingsPage() {
  const [selected, setSelected] = useState(MEETINGS[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = schema.safeParse({ ...data, meeting: selected });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    const meeting = MEETINGS.find((m) => m.id === selected)!;
    const subject = encodeURIComponent(`Guest place: ${meeting.title} on ${formatDate(meeting.date)}`);
    const body = encodeURIComponent(
      `Name: ${result.data.name}\nEmail: ${result.data.email}\nMeeting: ${meeting.title} — ${formatDate(meeting.date)} (${meeting.time})\n\n${result.data.notes ?? ""}`,
    );
    window.location.href = `mailto:${CLUB.email}?subject=${subject}&body=${body}`;
    toast.success("Thanks! Your email client will open so you can send the request.");
    form.reset();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Sign up for a meeting</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Guest places are free. Pick a date, tell us who you are, and a member of the committee will
        confirm your place and meet you at the door.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="choose-meeting">
          <h2 id="choose-meeting" className="text-xl font-bold">
            Choose a date
          </h2>
          <ul className="mt-4 space-y-3">
            {MEETINGS.map((m) => {
              const isSelected = selected === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(m.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-secondary">
                      <time dateTime={m.date}>{formatDate(m.date)}</time>
                    </span>
                    <span className="mt-1 block font-bold">{m.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {m.theme} · {m.time} · {m.format} · {m.spaces} guest places left
                      {isSelected ? " · selected" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="your-details">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle id="your-details" className="text-xl">
                Your details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="mt-2"
                  />
                  {errors.name ? (
                    <p id="name-error" className="mt-1 text-sm text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="mt-2"
                  />
                  {errors.email ? (
                    <p id="email-error" className="mt-1 text-sm text-destructive">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="notes">Anything we should know? (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    maxLength={1000}
                    className="mt-2"
                    placeholder="Accessibility needs, dietary requirements, or questions."
                  />
                </div>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  Selected: {formatDate(MEETINGS.find((m) => m.id === selected)!.date)}
                </p>
                <Button type="submit" size="lg" className="w-full">
                  Request my guest place
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}