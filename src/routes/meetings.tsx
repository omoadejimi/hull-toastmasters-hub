import { canonicalLinks, socialMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmailDraft, type PreparedEmail } from "@/components/site/EmailDraft";
import { CLUB, formatMeetingDate, getMeetings } from "@/data/club";

const TITLE = "Visit a Meeting | Hull Speakers";
const DESCRIPTION =
  "Choose an upcoming Hull Speakers meeting and prepare an email to request a guest visit. No public speaking experience needed.";

export const Route = createFileRoute("/meetings")({
  component: MeetingsPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      ...socialMeta("/meetings"),
    ],
    links: canonicalLinks("/meetings"),
  }),
});

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Use 100 characters or fewer for your name."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Use 255 characters or fewer for your email address."),
  meeting: z.string().min(1, "Choose a meeting date."),
  notes: z.string().trim().max(1000, "Use 1,000 characters or fewer for your notes.").optional(),
});

function MeetingsPage() {
  const meetings = useMemo(() => getMeetings(), []);
  const [selected, setSelected] = useState(meetings[0]?.id ?? "");
  const [showAllDates, setShowAllDates] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<PreparedEmail | null>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const draftRegion = useRef<HTMLDivElement>(null);
  const selectedMeeting = meetings.find((meeting) => meeting.id === selected);
  const visibleMeetings = meetings.filter(
    (meeting, index) => showAllDates || index < 4 || meeting.id === selected,
  );

  useEffect(() => {
    if (Object.keys(errors).length) {
      errorSummary.current?.focus({ preventScroll: true });
      errorSummary.current?.scrollIntoView({ block: "start" });
    }
  }, [errors]);
  useEffect(() => {
    if (draft) {
      draftRegion.current?.focus({ preventScroll: true });
      draftRegion.current?.scrollIntoView({ block: "start" });
    }
  }, [draft]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    setDraft(null);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    const meeting = meetings.find((item) => item.id === result.data.meeting);
    if (!meeting) {
      setErrors({ meeting: "Choose an available meeting date." });
      return;
    }
    setErrors({});
    setDraft({
      subject: `Guest visit: ${formatMeetingDate(meeting.date)}`,
      body: `Hello Hull Speakers,\n\nI would like to visit this meeting:\n${meeting.title}\n${formatMeetingDate(meeting.date)} (${meeting.time}, UK time)\n${meeting.location}\n\nName: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.notes || "Please let me know if I can attend."}`,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Visit a meeting</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        You are welcome to come along and see how a meeting works. Choose a date and prepare an
        email to the club. Please wait for the club to confirm your visit. You can watch and listen
        on your first visit.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Meeting times are UK local time. {CLUB.when}. Venue: {CLUB.venue}.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="choose-meeting" className="min-w-0">
          <h2 id="choose-meeting" className="text-xl font-bold">
            Choose a date
          </h2>
          {meetings.length ? (
            <fieldset
              className="mt-4"
              aria-describedby={errors.meeting ? "meeting-error" : "meeting-hint"}
            >
              <legend className="text-sm">Meeting date (required)</legend>
              <p id="meeting-hint" className="mt-2 text-sm text-muted-foreground">
                Select one meeting. Use the arrow keys to change dates when a radio button has
                focus.
              </p>
              {errors.meeting && (
                <p id="meeting-error" className="mt-2 text-sm text-destructive">
                  {errors.meeting}
                </p>
              )}
              <div id="meeting-dates" className="mt-3 space-y-3">
                {visibleMeetings.map((meeting, index) => (
                  <label
                    key={meeting.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${selected === meeting.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                  >
                    <input
                      type="radio"
                      id={index === 0 ? "meeting" : `meeting-${meeting.id}`}
                      name="meeting"
                      value={meeting.id}
                      form="guest-request"
                      required
                      checked={selected === meeting.id}
                      aria-invalid={Boolean(errors.meeting)}
                      aria-describedby={errors.meeting ? "meeting-error" : undefined}
                      onChange={() => {
                        setSelected(meeting.id);
                        setDraft(null);
                      }}
                      className="mt-1 size-5 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-secondary">
                        <time dateTime={meeting.date}>{formatMeetingDate(meeting.date)}</time>
                      </span>
                      <span className="mt-1 block text-sm">
                        {meeting.time} · {meeting.format}
                      </span>
                      <span className="mt-1 block text-sm">{meeting.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {meeting.location}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {meetings.length > 4 && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  aria-expanded={showAllDates}
                  aria-controls="meeting-dates"
                  onClick={() => setShowAllDates((showAll) => !showAll)}
                >
                  {showAllDates ? "Show fewer dates" : `Show all ${meetings.length} dates`}
                </Button>
              )}
            </fieldset>
          ) : (
            <p className="mt-4">
              No upcoming dates are currently listed.{" "}
              <a className="underline" href={`mailto:${CLUB.email}`}>
                Email the club to arrange a visit
              </a>
              .
            </p>
          )}
        </section>
        <section aria-labelledby="your-details" className="min-w-0">
          <Card className="card-elevated">
            <CardHeader>
              <h2 id="your-details" className="text-xl font-bold">
                Your details
              </h2>
            </CardHeader>
            <CardContent>
              <p id="guest-instructions" className="mb-5 text-sm text-muted-foreground">
                Name and email are required. This form prepares a draft; you must send it using your
                email service. We cannot confirm email delivery or reserve a place here. Your
                details stay on this page until you open or copy the draft.
              </p>
              <form
                method="post"
                id="guest-request"
                onSubmit={onSubmit}
                onChange={() => setDraft(null)}
                noValidate
                aria-describedby="guest-instructions"
                className="space-y-5"
              >
                {Object.keys(errors).length > 0 && (
                  <div
                    ref={errorSummary}
                    id="form-error-summary"
                    tabIndex={-1}
                    role="alert"
                    aria-labelledby="guest-errors-title"
                    className="rounded-md border border-destructive p-4"
                  >
                    <h3 id="guest-errors-title" className="font-bold">
                      Please check these details
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>
                          <a
                            className="inline-flex min-h-11 items-center underline"
                            href={`#${field}`}
                          >
                            {message}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <Label htmlFor="name">Full name (required)</Label>
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
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email address (required)</Label>
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
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="notes">Questions or access needs (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    maxLength={1000}
                    className="mt-2"
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={`notes-hint${errors.notes ? " notes-error" : ""}`}
                  />
                  <p id="notes-hint" className="mt-1 text-sm text-muted-foreground">
                    Up to 1,000 characters. Only include information you are comfortable sharing by
                    email.
                  </p>
                  {errors.notes && (
                    <p id="notes-error" className="mt-1 text-sm text-destructive">
                      {errors.notes}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {selectedMeeting
                    ? `Selected: ${formatMeetingDate(selectedMeeting.date)}`
                    : "No meeting selected."}
                </p>
                <noscript>
                  <p>
                    JavaScript is needed to prepare a draft here.{" "}
                    <a className="underline" href={`mailto:${CLUB.email}`}>
                      Email {CLUB.email} directly
                    </a>
                    .
                  </p>
                </noscript>
                <Button type="submit" size="lg" className="w-full" disabled={!meetings.length}>
                  Prepare email request
                </Button>
              </form>
              <div id="prepared-email-draft" ref={draftRegion} tabIndex={-1}>
                {draft && <EmailDraft key={`${draft.subject}${draft.body}`} {...draft} />}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
