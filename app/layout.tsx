import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider, themeInitScript } from "@/components/Theme";
import { ToastProvider } from "@/components/Toast";
import { SiteUIProvider } from "@/components/SiteUI";
import { CommandPalette } from "@/components/CommandPalette";
import { BriefSheet, FloatingDock } from "@/components/Mobile";
import { asset } from "@/lib/content";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["500"] });

export const metadata: Metadata = {
  title: {
    default: "Better Shapes — Good ideas. Better shape.",
    template: "%s · Better Shapes",
  },
  description:
    "Better Shapes is an independent studio for design, technology, AI and marketing, with Labs exploring physical automation. One calm team that turns good ideas into products people trust.",
  icons: { icon: asset("/favicon.svg") },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#15161c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteUIProvider>
            <ToastProvider>
              <SmoothScroll />
              <Nav />
              <main>{children}</main>
              <Footer />
              <CommandPalette />
              <BriefSheet />
              <FloatingDock />
            </ToastProvider>
          </SiteUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
