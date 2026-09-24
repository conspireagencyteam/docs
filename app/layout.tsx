import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter, Manrope } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import IntercomChat from "@/components/IntercomChat";

// Inter for the docs (fumadocs default look), Manrope for the marketing pages
// (the getbonde.com brand face, carried over from the Shopify theme).
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-app",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.homeTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${manrope.variable} ${sans.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <IntercomChat />
        </RootProvider>
      </body>
    </html>
  );
}
