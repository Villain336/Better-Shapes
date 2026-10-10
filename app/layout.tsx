import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["400", "500", "600", "700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400", "500", "600"] });
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
    <html lang="en" className={`${manrope.variable} ${jakarta.variable} ${geistMono.variable}`}>
      <body>
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
