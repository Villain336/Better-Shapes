/** "— SECTION" — a short rule and a mono label, the one place we use the accent blue. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`label inline-flex items-center gap-2.5 text-accent ${className}`}>
      <span aria-hidden className="h-px w-4 bg-current" />
      {children}
    </span>
  );
}
