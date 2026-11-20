import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { getPageMarkdown, MARKDOWN_HEADERS } from "@/lib/llm";

/**
 * Markdown version of each docs page. Reached through the rewrites in
 * next.config.mjs: /docs/<slug>.md, and /docs/<slug> with
 * `Accept: text/markdown`. Never linked directly.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return new Response(await getPageMarkdown(page), { headers: MARKDOWN_HEADERS });
}

export function generateStaticParams() {
  return source.generateParams();
}
