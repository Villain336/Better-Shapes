"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SubmitButton } from "./Button";

// No backend yet: submissions open the visitor's mail client addressed to the studio.
const STUDIO_EMAIL = "hello@bettershapes.co";

const field =
  "w-full rounded-2xl bg-raised px-5 py-4 text-[16px] outline-none ring-brand-blue/40 placeholder:text-ink-3 focus:ring-2";

function Sent({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[16px] font-medium text-ink"
      role="status"
    >
      {children}
    </motion.p>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`New project from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="sr-only" htmlFor="name">Your name</label>
      <input id="name" name="name" required placeholder="Your name" className={field} />
      <label className="sr-only" htmlFor="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" required placeholder="Email" className={field} />
      <label className="sr-only" htmlFor="message">What are you shaping?</label>
      <textarea id="message" name="message" required rows={4} placeholder="What are you shaping?" className={`${field} resize-none`} />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton>Send message</SubmitButton>
        <AnimatePresence>{sent && <Sent>Thanks — we’ll reply within one business day.</Sent>}</AnimatePresence>
      </div>
    </form>
  );
}

export function NewsletterForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="glass flex flex-col items-stretch justify-between gap-4 rounded-[32px] p-4 md:flex-row md:items-center md:rounded-full md:py-4 md:pl-10 md:pr-4"
    >
      <span className="text-[22px] font-medium tracking-[-0.04em] md:text-[24px]">Get one calm, useful email a month.</span>
      {sent ? (
        <Sent>You’re on the list. See you in the meadow.</Sent>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            className="h-12 rounded-full bg-raised px-5 text-[16px] outline-none ring-brand-blue/40 placeholder:text-ink-3 focus:ring-2 sm:w-[300px]"
          />
          <SubmitButton>Subscribe</SubmitButton>
        </div>
      )}
    </form>
  );
}
