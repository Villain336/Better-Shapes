import Link from "next/link";
import { LogoMark } from "./Logo";

const cols = [
  {
    title: "Studio",
    links: [
      ["Work", "/work"],
      ["Pricing", "/pricing"],
      ["About", "/about"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "Capabilities",
    links: [
      ["Tech", "/work"],
      ["Design", "/work"],
      ["Robotics", "/work"],
      ["Marketing", "/work"],
    ],
  },
  {
    title: "Say hi",
    links: [
      ["hello@bettershapes.co", "mailto:hello@bettershapes.co"],
      ["LinkedIn", "#"],
      ["Instagram", "#"],
      ["Dribbble", "#"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="container-x flex flex-col gap-16 pb-10 pt-[72px]">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 font-display text-[22px] font-semibold tracking-[-0.045em]">
              <LogoMark />
              Better Shapes
            </Link>
            <p className="max-w-[360px] text-[16px] leading-[1.55] text-white/65">
              Design, technology, robotics &amp; growth — shaped by one calm team.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-24">
            {cols.map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <span className="caption text-white/50">{c.title}</span>
                {c.links.map(([label, href]) => (
                  <Link key={label} href={href} className="text-[16px] transition-colors hover:text-brand-yellow">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="select-none whitespace-nowrap font-display text-[clamp(60px,14.5vw,210px)] font-semibold leading-[0.85] tracking-[-0.07em] text-white/[0.08]"
        >
          Better Shapes
        </div>
        <div className="caption flex flex-col justify-between gap-2 text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Better Shapes Studio</span>
          <span>Made with calm in the meadow</span>
        </div>
      </div>
    </footer>
  );
}
