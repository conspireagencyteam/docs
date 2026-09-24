import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { site } from "@/lib/site";
import { FEATURES } from "@/lib/features";

export default function sitemap(): MetadataRoute.Sitemap {
  const marketing: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...FEATURES.map((f) => ({
      url: `${site.url}/${f.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/accessibility`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const docs: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${site.url}${page.url}`,
    changeFrequency: "monthly" as const,
    priority: page.url === site.docsPath ? 0.8 : 0.6,
  }));

  return [...marketing, ...docs];
}
