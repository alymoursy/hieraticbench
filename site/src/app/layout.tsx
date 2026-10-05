import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const description =
  "An Oxford Egyptologist wrote one sentence in hieratic, the handwriting of ancient Egypt. No AI model can read it. HieraticBench measures how close they are.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "HieraticBench. Can AI read ancient Egyptian handwriting?", template: "%s. HieraticBench" },
  description,
  openGraph: {
    title: "No AI can read this sentence.",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={newsreader.variable}>
      <body>
        <div className="isolate flex min-h-dvh flex-col">
          <Nav />
          <main className="flex-1 overflow-x-clip">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
