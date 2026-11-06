import { canonicalLinks, socialMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmailDraft, type PreparedEmail } from "@/components/site/EmailDraft";
import { CLUB } from "@/data/club";

const TITLE = "Contact Hull Speakers | Ask Us Anything";
const DESCRIPTION =
  "Contact Hull Speakers about visiting, membership, accessibility or public speaking. Prepare an email to the club.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      ...socialMeta("/contact"),
    ],
    links: canonicalLinks("/contact"),
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
  subject: z
    .string()
    .trim()
    .min(2, "Add a subject of at least 2 characters.")
    .max(150, "Use 150 characters or fewer for the subject."),
  message: z
    .string()
    .trim()
    .min(10, "Write a message of at least 10 characters.")
    .max(1000, "Use 1,000 characters or fewer for the message."),
});

const fields = [
  { id: "name", label: "Full name", type: "text", autoComplete: "name", maxLength: 100 },
  { id: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 255 },
  { id: "subject", label: "Subject", type: "text", autoComplete: "off", maxLength: 150 },
] as const;

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<PreparedEmail | null>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const draftRegion = useRef<HTMLDivElement>(null);

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
    setErrors({});
    const { name, email, subject, message } = result.data;
    setDraft({ subject, body: `${message}\n\nFrom: ${name}\nEmail: ${email}` });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Contact us</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Have questions about visiting, membership or accessibility? Prepare an email below, or email{" "}
        <a className="underline" href={`mailto:${CLUB.email}`}>
          {CLUB.email}
        </a>{" "}
        directly.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Card className="card-elevated min-w-0">
          <CardHeader>
            <h2 className="text-xl font-bold">Prepare a message</h2>
          </CardHeader>
          <CardContent>
            <p id="contact-instructions" className="mb-5 text-sm text-muted-foreground">
              All fields are required. This form prepares a draft; you must send it using your email
              service. We cannot confirm email delivery here. Your details stay on this page until
              you open or copy the draft.
            </p>
            <form
              method="post"
              onSubmit={onSubmit}
              onChange={() => setDraft(null)}
              noValidate
              aria-describedby="contact-instructions"
              className="space-y-5"
            >
              {Object.keys(errors).length > 0 && (
                <div
                  ref={errorSummary}
                  id="form-error-summary"
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="contact-errors-title"
                  className="rounded-md border border-destructive p-4"
                >
                  <h3 id="contact-errors-title" className="font-bold">
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
              {fields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label} (required)</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    maxLength={field.maxLength}
                    className="mt-2"
                    aria-invalid={Boolean(errors[field.id])}
                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  />
                  {errors[field.id] && (
                    <p id={`${field.id}-error`} className="mt-1 text-sm text-destructive">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <Label htmlFor="message">Message (required)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  maxLength={1000}
                  className="mt-2"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={`message-hint${errors.message ? " message-error" : ""}`}
                />
                <p id="message-hint" className="mt-1 text-sm text-muted-foreground">
                  10–1,000 characters. Only include information needed for your enquiry.
                </p>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-destructive">
                    {errors.message}
                  </p>
                )}
              </div>
              <noscript>
                <p>
                  JavaScript is needed to prepare a draft here.{" "}
                  <a className="underline" href={`mailto:${CLUB.email}`}>
                    Email {CLUB.email} directly
                  </a>
                  .
                </p>
              </noscript>
              <Button type="submit" size="lg" className="w-full">
                Prepare email draft
              </Button>
            </form>
            <div id="prepared-email-draft" ref={draftRegion} tabIndex={-1}>
              {draft && <EmailDraft key={`${draft.subject}${draft.body}`} {...draft} />}
            </div>
          </CardContent>
        </Card>
        <section aria-labelledby="details" className="min-w-0">
          <h2 id="details" className="text-xl font-bold">
            Club details
          </h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-secondary" />
              <span>{CLUB.venue}</span>
            </li>
            <li className="flex gap-3">
              <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-secondary" />
              <span>{CLUB.when}</span>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-secondary" />
              <a className="break-all underline" href={`mailto:${CLUB.email}`}>
                {CLUB.email}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm">
            <a
              className="underline"
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(CLUB.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find the venue on OpenStreetMap (opens in a new tab)
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
