import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CLUB } from "@/data/club";

export type PreparedEmail = { subject: string; body: string };

/** A mailto link cannot confirm delivery. Keep a readable fallback on the page. */
export function EmailDraft({ subject, body }: PreparedEmail) {
  const [copyStatus, setCopyStatus] = useState("");
  const text = `To: ${CLUB.email}\nSubject: ${subject}\n\n${body}`;
  const href = `mailto:${CLUB.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Email draft copied. Paste it into your email service and send it.");
    } catch {
      setCopyStatus(
        "Copy is unavailable. Select and copy the draft below, then paste it into your email service.",
      );
    }
  }

  return (
    <section
      aria-labelledby="email-draft-title"
      className="mt-6 space-y-4 rounded-lg border border-border bg-muted p-4"
    >
      <h3 id="email-draft-title" className="text-lg font-bold">
        Your email draft is ready
      </h3>
      <p role="status" className="text-sm">
        Nothing has been sent. Open your email app, review the draft and send it to {CLUB.email}. If
        no email app opens, copy the draft into your usual email service.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={href}>Open email app</a>
        </Button>
        <Button type="button" variant="outline" onClick={copyDraft}>
          Copy email draft
        </Button>
      </div>
      <p role="status" className="text-sm">
        {copyStatus}
      </p>
      <label htmlFor="email-draft" className="block text-sm font-semibold">
        Email draft to review or copy
      </label>
      <textarea
        id="email-draft"
        readOnly
        value={text}
        rows={10}
        className="w-full rounded-md border border-input bg-background p-3 text-sm"
      />
    </section>
  );
}
