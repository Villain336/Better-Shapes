"use client";

import { useState } from "react";
import { plans, type Billing } from "@/lib/content";
import { PricingCard } from "./Cards";
import { SegmentedControl } from "./Primitives";
import { RevealItem, Stagger } from "./Reveal";

/** The two memberships with a monthly / quarterly switch above them. */
export function PricingPlans({ aside }: { aside: React.ReactNode }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label text-ink-3">Billing</span>
        <SegmentedControl
          label="Billing period"
          value={billing}
          onChange={setBilling}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly", hint: "save 10%" },
          ]}
        />
      </div>
      <Stagger className="grid items-stretch gap-4 lg:grid-cols-3" stagger={0.08}>
        {plans.map((p) => (
          <RevealItem key={p.name} className="h-full">
            <PricingCard {...p} price={p.price[billing]} period={billing === "monthly" ? "/month" : "/month, billed quarterly"} />
          </RevealItem>
        ))}
        <RevealItem className="h-full">{aside}</RevealItem>
      </Stagger>
    </div>
  );
}
