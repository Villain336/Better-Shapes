"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitButton } from "./Button";
import { BRIEF_KEY, briefToMessage } from "./HeroBrief";
import { Panel } from "./Panel";
import { useToast } from "./Toast";

/**
 * Forms post to Web3Forms (https://web3forms.com). The access key is public by design (it only lets
 * people send submissions to our inbox), so the studio's key is built in. NEXT_PUBLIC_WEB3FORMS_KEY
 * overrides it; `||` because the deploy workflow passes an empty string when its variable is unset.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "f3f3725a-492d-406e-9a0c-b57172192ed4";

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

function useSubmit(sentTitle: string, sentBody: string) {
  const [status, setStatus] = useState<Status>("idle");
  const { toast } = useToast();
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
    // Errors stay inline next to the field; success also gets a toast because the form resets.
    if (result === "sent") {
      form.reset();
      toast({ tone: "success", title: sentTitle, body: sentBody });
    }
  };
  return { status, send };
}

const messages: Record<Exclude<Status, "idle" | "sending">, (sent: string) => React.ReactNode> = {
  sent: (sent) => sent,
  error: () => <>Something went wrong. Please try again in a moment.</>,
  offline: () => <>This form isn’t connected yet. Please check back soon.</>,
};

function StatusLine({ status, sent }: { status: Status; sent: string }) {
  if (status === "idle" || status === "sending") return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-[14px] font-medium ${status === "sent" ? "text-ink" : "text-brand-red"}`}
      role="status"
    >
      {messages[status](sent)}
    </motion.p>
  );
}

const Honeypot = () => <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />;

function Field({ label, id, ...rest }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label text-ink-3">
        {label}
      </label>
      <input id={id} className="field" {...rest} />
    </div>
  );
}

export function ContactForm() {
  const { status, send } = useSubmit("Message sent", "We reply within a business day.");
  const [message, setMessage] = useState("");

  // If someone came through the home-page brief, start the message for them.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BRIEF_KEY);
      if (!raw) return;
      sessionStorage.removeItem(BRIEF_KEY);
      setMessage(briefToMessage(JSON.parse(raw)));
    } catch {
      /* nothing to prefill */
    }
  }, []);

  return (
    <form onSubmit={(e) => send(e, { subject: "New project inquiry", form: "contact" })} className="flex flex-col gap-4">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="name" name="name" required placeholder="Your name" autoComplete="name" />
        <Field label="Email" id="contact-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="label text-ink-3">
          What are you shaping?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A sentence or two is plenty."
          className="field resize-none"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <SubmitButton>{status === "sending" ? "Sending…" : "Send message"}</SubmitButton>
        <span className="small text-ink-3">We reply within one business day.</span>
      </div>
      <AnimatePresence>
        <StatusLine status={status} sent="Thanks! We’ll reply within one business day." />
      </AnimatePresence>
    </form>
  );
}

function InlineForm({
  title,
  body,
  button,
  sent,
  extra,
  id,
}: {
  title: React.ReactNode;
  body?: string;
  button: string;
  sent: string;
  extra: Record<string, string>;
  id: string;
}) {
  const { status, send } = useSubmit(
    extra.form === "waitlist" ? "You’re on the list" : "Subscribed",
    extra.form === "waitlist" ? "We’ll email you first." : "Essays, now and then. No noise.",
  );
  return (
    <Panel className="flex flex-col justify-between gap-5 p-5 md:flex-row md:items-center md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="h3">{title}</h3>
        {body && <p className="small">{body}</p>}
      </div>
      {status === "sent" ? (
        <StatusLine status={status} sent={sent} />
      ) : (
        <form onSubmit={(e) => send(e, extra)} className="flex flex-col gap-2">
          <Honeypot />
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor={id}>
              Email
            </label>
            <input id={id} name="email" type="email" required placeholder="you@company.com" className="field h-11 sm:w-[280px]" autoComplete="email" />
            <SubmitButton>{status === "sending" ? "Sending…" : button}</SubmitButton>
          </div>
          <StatusLine status={status} sent={sent} />
        </form>
      )}
    </Panel>
  );
}

export function NewsletterForm() {
  return (
    <InlineForm
      id="newsletter-email"
      title="One calm, useful email a month."
      body="Launch news, what we’re building and what we’re learning. No spam."
      button="Subscribe"
      sent="You’re on the list. See you in the meadow."
      extra={{ subject: "Newsletter signup", form: "newsletter" }}
    />
  );
}

export function WaitlistForm({ product, title, body }: { product: string; title?: string; body?: string }) {
  return (
    <InlineForm
      id={`waitlist-${product.toLowerCase().replace(/\W+/g, "-")}`}
      title={title ?? `Join the ${product} waitlist.`}
      body={body ?? "We’ll email you first, and only about this."}
      button="Join"
      sent={`You’re on the ${product} list. We’ll email you first.`}
      extra={{ subject: `Waitlist: ${product}`, form: "waitlist", product }}
    />
  );
}
