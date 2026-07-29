import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLUB } from "@/data/club";

const TITLE = "Contact Hull Toastmasters | Ask Us Anything";
const DESCRIPTION =
  "Get in touch with Hull Toastmasters about visiting, membership, accessibility or speaking at your organisation. We reply within a few days.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1000),
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = schema.safeParse(Object.fromEntries(new FormData(form)));

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    const { name, email, subject, message } = result.data;
    window.location.href = `mailto:${CLUB.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
    toast.success("Thanks! Your email client will open so you can send the message.");
    form.reset();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Contact us</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Have questions about visiting, membership, or accessibility? Send us a message and a
        committee member will get back to you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-xl">Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {(
                [
                  { id: "name", label: "Full name", type: "text", autoComplete: "name" },
                  { id: "email", label: "Email address", type: "email", autoComplete: "email" },
                  { id: "subject", label: "Subject", type: "text", autoComplete: "off" },
                ] as const
              ).map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    maxLength={255}
                    className="mt-2"
                    aria-invalid={Boolean(errors[field.id])}
                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                  />
                  {errors[field.id] ? (
                    <p id={`${field.id}-error`} className="mt-1 text-sm text-destructive">
                      {errors[field.id]}
                    </p>
                  ) : null}
                </div>
              ))}
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  maxLength={1000}
                  className="mt-2"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-1 text-sm text-destructive">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" size="lg" className="w-full">
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>

        <section aria-labelledby="details">
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
              <a className="hover:underline" href={`mailto:${CLUB.email}`}>
                {CLUB.email}
              </a>
            </li>
          </ul>
          <div className="mt-8 overflow-hidden rounded-lg border border-border">
            <iframe
              title="Map showing Hull Central Library, Albion Street, Hull"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.3430%2C53.7420%2C-0.3280%2C53.7480&layer=mapnik"
            />
          </div>
        </section>
      </div>
    </div>
  );
}