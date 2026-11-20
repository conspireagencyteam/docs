import { source } from "@/lib/source";
import { site } from "@/lib/site";

type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

/** The Markdown address of a docs page: /docs/<slug>.md (the docs home is /docs.md). */
export function markdownPath(pageUrl: string): string {
  return `${pageUrl}.md`;
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}

/**
 * The Markdown version of a docs page: the same title, description and body
 * people see on the HTML page, with the MDX components rendered as Markdown
 * (see source.config.ts) and internal links made absolute so the text stands
 * on its own outside the site.
 */
export async function getPageMarkdown(page: DocsPage): Promise<string> {
  const body = await page.data.getText("processed");
  const absolute = body.replace(/\]\(\/(?!\/)/g, `](${site.url}/`);
  const parts = [`# ${page.data.title}`];
  if (page.data.description) parts.push(`> ${page.data.description}`);
  parts.push(`Source: ${absoluteUrl(page.url)}`);
  parts.push(absolute.trim());
  return `${parts.join("\n\n")}\n`;
}

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
} as const;

type TreeNode = (typeof source.pageTree.children)[number];

/** Docs pages in sidebar order, grouped by the sidebar's top-level sections. */
export function docsSections(): { title: string; pages: DocsPage[] }[] {
  const sections: { title: string; pages: DocsPage[] }[] = [];
  const loose: DocsPage[] = [];
  const pagesIn = (node: TreeNode, out: DocsPage[]) => {
    if (node.type === "page") {
      const page = source.getNodePage(node);
      if (page) out.push(page);
    } else if (node.type === "folder") {
      if (node.index) pagesIn(node.index, out);
      for (const child of node.children) pagesIn(child, out);
    }
  };
  for (const node of source.pageTree.children) {
    if (node.type === "folder") {
      const pages: DocsPage[] = [];
      pagesIn(node, pages);
      if (pages.length) sections.push({ title: String(node.name), pages });
    } else {
      pagesIn(node, loose);
    }
  }
  if (loose.length) sections.unshift({ title: "Overview", pages: loose });
  return sections;
}

const escapeLinkText = (s: string) => s.replace(/([[\]])/g, "\\$1");

/** /llms.txt in the llmstxt.org format. */
export function llmsIndex(): string {
  const out = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is a Shopify app built by Conspire (${site.agencyUrl}). Every page below is the Markdown version of a page in the merchant docs at ${absoluteUrl(site.docsPath)}; the whole set is in one file at ${absoluteUrl("/llms-full.txt")}.`,
    "",
    `- [${site.name} on the Shopify App Store](${site.appStoreUrl}): install the app`,
    `- [Website](${site.url}): features and pricing`,
  ];
  for (const section of docsSections()) {
    out.push("", `## ${section.title}`, "");
    for (const page of section.pages) {
      const link = `[${escapeLinkText(page.data.title)}](${absoluteUrl(markdownPath(page.url))})`;
      const description = page.data.description?.trim();
      out.push(description ? `- ${link}: ${description}` : `- ${link}`);
    }
  }
  return `${out.join("\n")}\n`;
}

/** /llms-full.txt: every docs page's Markdown, in sidebar order. */
export async function llmsFull(): Promise<string> {
  const pages = docsSections().flatMap((s) => s.pages);
  const texts = await Promise.all(pages.map(getPageMarkdown));
  return `# ${site.name} docs\n\n> ${site.description}\n\n---\n\n${texts.join("\n---\n\n")}`;
}
