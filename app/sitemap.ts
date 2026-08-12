import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${site.url}${page.url === "/" ? "" : page.url}`,
    changeFrequency: "monthly" as const,
    priority: page.url === "/" ? 1 : 0.6,
  }));
}
