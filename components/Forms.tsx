"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitButton } from "./Button";

/**
 * Forms post to Web3Forms (https://web3forms.com). Set NEXT_PUBLIC_WEB3FORMS_KEY to the access key
 * (it is meant to be public). Without it, forms say so instead of pretending to send.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const STUDIO_EMAIL = "hello@bettershapes.co";

type Status = "idle" | "sending" | "sent" | "error" | "offline";

async function submit(fields: Record<string, string>): Promise<Status> {
  if (!ACCESS_KEY) return "offline";
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: ACCESS_KEY, from_name: "Better Shapes website", ...fields }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success ? "sent" : "error";
  } catch {
    return "error";
  }
}

function useSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const send = async (e: React.FormEvent<HTMLFormElement>, extra: Record<string, string>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, String(v)]),
    ) as Record<string, string>;
    // Honeypot: bots fill hidden fields.
    if (fields.botcheck) return;
    delete fields.botcheck;
    setStatus("sending");
    const result = await submit({ ...fields, ...extra });
    setStatus(result);
    if (result === "sent") form.reset();
  };
  return { status, send };
}

const messages: Record<Exclude<Status, "idle" | "sending">, (sent: string) => React.ReactNode> = {
  sent: (sent) => sent,
  error: () => (
    <>
      Something went wrong. Email us at <a className="underline" href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
    </>
  ),
  offline: () => (
    <>
      This form isn’t connected yet. Email us at <a className="underline" href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
    </>
  ),
};

function StatusLine({ status, sent }: { status: Status; sent: string }) {
  if (status === "idle" || status === "sending") return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-[16px] font-medium ${status === "sent" ? "text-ink" : "text-brand-red"}`}
      role="status"
    >
      {messages[status](sent)}
    </motion.p>
  );
}

const Honeypot = () => <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />;

const field =
  "w-full rounded-2xl bg-raised px-5 py-4 text-[16px] outline-none ring-brand-blue/40 placeholder:text-ink-3 focus:ring-2";
const pillInput =
  "h-12 rounded-full bg-raised px-5 text-[16px] outline-none ring-brand-blue/40 placeholder:text-ink-3 focus:ring-2 sm:w-[300px]";

export function ContactForm() {
  const { status, send } = useSubmit();
  return (
    <form onSubmit={(e) => send(e, { subject: "New project inquiry", form: "contact" })} className="flex flex-col gap-4">
      <Honeypot />
      <label className="sr-only" htmlFor="name">Your name</label>
      <input id="name" name="name" required placeholder="Your name" className={field} />
      <label className="sr-only" htmlFor="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" required placeholder="Email" className={field} />
      <label className="sr-only" htmlFor="message">What are you shaping?</label>
      <textarea id="message" name="message" required rows={4} placeholder="What are you shaping?" className={`${field} resize-none`} />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton>{status === "sending" ? "Sending…" : "Send message"}</SubmitButton>
        <AnimatePresence>
          <StatusLine status={status} sent="Thanks! We’ll reply within one business day." />
        </AnimatePresence>
      </div>
    </form>
  );
}

function PillForm({
  title,
  button,
  sent,
  extra,
  id,
}: {
  title: React.ReactNode;
  button: string;
  sent: string;
  extra: Record<string, string>;
  id: string;
}) {
  const { status, send } = useSubmit();
  return (
    <form
      onSubmit={(e) => send(e, extra)}
      className="glass flex flex-col items-stretch justify-between gap-4 rounded-[32px] p-4 md:flex-row md:items-center md:rounded-full md:py-4 md:pl-10 md:pr-4"
    >
      <Honeypot />
      <span className="font-display text-[22px] font-semibold tracking-[-0.045em] md:text-[24px]">{title}</span>
      {status === "sent" ? (
        <StatusLine status={status} sent={sent} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor={id}>Email</label>
            <input id={id} name="email" type="email" required placeholder="you@company.com" className={pillInput} />
            <SubmitButton>{status === "sending" ? "Sending…" : button}</SubmitButton>
          </div>
          <StatusLine status={status} sent={sent} />
        </div>
      )}
    </form>
  );
}

export function NewsletterForm() {
  return (
    <PillForm
      id="newsletter-email"
      title="Get one calm, useful email a month."
      button="Subscribe"
      sent="You’re on the list. See you in the meadow."
      extra={{ subject: "Newsletter signup", form: "newsletter" }}
    />
  );
}

export function WaitlistForm({ product, title }: { product: string; title?: string }) {
  return (
    <PillForm
      id={`waitlist-${product.toLowerCase().replace(/\W+/g, "-")}`}
      title={title ?? `Join the ${product} waitlist.`}
      button="Join"
      sent={`You’re on the ${product} list. We’ll email you first.`}
      extra={{ subject: `Waitlist: ${product}`, form: "waitlist", product }}
    />
  );
}
