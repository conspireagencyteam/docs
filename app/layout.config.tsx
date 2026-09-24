import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { site } from "@/lib/site";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/bonde-black.svg"
          alt="Bonde"
          className="h-5 w-auto dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/bonde-white.svg"
          alt="Bonde"
          className="hidden h-5 w-auto dark:block"
        />
      </>
    ),
    url: site.docsPath,
  },
  links: [
    {
      text: "Website",
      url: "/",
    },
    {
      text: "Pricing",
      url: "/#pricing",
    },
    {
      text: "Install on Shopify",
      url: site.appStoreUrl,
      external: true,
    },
    {
      text: "Support",
      url: `mailto:${site.supportEmail}`,
    },
  ],
};
