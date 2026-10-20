import Link from "next/link";
import { LogoMark } from "./Logo";

const cols = [
  {
    title: "Studio",
    links: [
      ["Work", "/work"],
      ["Products", "/products"],
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
      ["Marketing", "/work"],
      ["Labs", "/labs"],
    ],
  },
  {
    title: "Say hi",
    links: [
      ["Contact", "/about#contact"],
      ["Newsletter", "/blog#newsletter"],
      ["Waitlists", "/products"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="hairline-t bg-surface">
      <div className="container-x flex flex-col gap-14 pb-24 pt-16 md:pb-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] lg:grid-cols-[1.6fr_2fr]">
          <div className="flex max-w-[320px] flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 font-display text-[16px] font-semibold tracking-[-0.02em]">
              <LogoMark />
              Better Shapes
            </Link>
            <p className="small">
              An independent studio for design, technology, AI and growth. One calm team that turns good ideas into
              products people trust.
            </p>
            <Link href="/about#contact" className="small w-fit text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink">
              Start a conversation
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title} className="flex flex-col gap-3.5">
                <span className="label text-ink-3">{c.title}</span>
                <ul className="flex flex-col gap-2.5">
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-[14px] text-ink-2 transition-colors hover:text-ink">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="hairline-t flex flex-col justify-between gap-2 pt-6 text-[12px] text-ink-3 sm:flex-row">
          <span>© {new Date().getFullYear()} Better Shapes Studio</span>
          <span>Paintings by the studio. Set in Manrope and Inter.</span>
        </div>
      </div>
    </footer>
  );
}
