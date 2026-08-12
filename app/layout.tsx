import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { site } from "@/lib/site";
import IntercomChat from "@/components/IntercomChat";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-app",
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
      className={`${sans.variable} ${sans.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
            <IntercomChat />
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
