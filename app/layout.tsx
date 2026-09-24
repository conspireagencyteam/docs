import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import IntercomChat from "@/components/IntercomChat";

// Inter for the docs (fumadocs default look). Manrope — the getbonde.com
// brand face carried over from the Shopify theme — is loaded from Google
// Fonts via <link> in <head>, not next/font/google: Turbopack's build-time
// font fetch failed the first production deploy with "next/font/google
// queries have exactly one entry" while the identical preview passed.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-app",
});
const MANROPE_CSS =
  "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap";

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
      className={`${sans.variable} ${sans.className}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={MANROPE_CSS} />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <IntercomChat />
        </RootProvider>
      </body>
    </html>
  );
}
