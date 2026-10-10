import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["400", "500", "600"] });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["italic", "normal"],
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["500"] });

export const metadata: Metadata = {
  title: {
    default: "Better Shapes — Good ideas. Better shape.",
    template: "%s · Better Shapes",
  },
  description:
    "Better Shapes is an independent studio for design, technology, robotics and marketing — one calm team that turns good ideas into products people trust.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f1efea" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrument.variable} ${geistMono.variable}`}>
      <body>
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
