import { execFileSync } from "node:child_process";
import path from "node:path";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Nodes, Parents } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import type { Info, State } from "mdast-util-to-markdown";

/**
 * Last commit date per docs file, for the sitemap's <lastmod>.
 *
 * Read from `git log` once per build. A shallow clone (Vercel's default is
 * depth 10) would date every older file to the oldest fetched commit, so on a
 * shallow clone no dates are emitted at all rather than wrong ones. The
 * Vercel project sets VERCEL_DEEP_CLONE=true so production builds get the
 * full history.
 */
let gitDates: Promise<Map<string, Date>> | undefined;
function loadGitDates(): Promise<Map<string, Date>> {
  gitDates ??= (async () => {
    const dates = new Map<string, Date>();
    try {
      const git = (...args: string[]) =>
        execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
      if (git("rev-parse", "--is-shallow-repository") === "true") {
        console.warn("[lastModified] shallow git clone: sitemap dates omitted");
        return dates;
      }
      const root = git("rev-parse", "--show-toplevel");
      let current: Date | undefined;
      for (const line of git("-c", "core.quotepath=off", "log", "--format=commit:%cI", "--name-only", "--", "content/docs").split("\n")) {
        if (line.startsWith("commit:")) {
          const d = new Date(line.slice(7));
          current = Number.isNaN(d.getTime()) ? undefined : d;
        } else if (line && current) {
          const file = path.join(root, line);
          if (!dates.has(file)) dates.set(file, current);
        }
      }
    } catch (err) {
      console.warn("[lastModified] git unavailable: sitemap dates omitted", err);
    }
    return dates;
  })();
  return gitDates;
}

type Jsx = MdxJsxFlowElement | MdxJsxTextElement;

function attr(node: Jsx, name: string): string | undefined {
  for (const a of node.attributes) {
    if (a.type === "mdxJsxAttribute" && a.name === name && typeof a.value === "string") return a.value;
  }
  return undefined;
}

const CALLOUT_LABEL: Record<string, string> = {
  Note: "Note",
  Warning: "Warning",
  Tip: "Tip",
  Callout: "Note",
};

/**
 * The Markdown version of each docs page (served at /docs/<slug>.md and to
 * `Accept: text/markdown`) renders the MDX components as plain Markdown, so
 * it reads the same as the page people see.
 */
function stringifyComponent(node: Nodes, parent: Parents | undefined, state: State, info: Info): string | undefined {
  if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return undefined;
  const children = () => state.containerFlow(node as MdxJsxFlowElement, info).trim();

  switch (node.name) {
    case "Note":
    case "Warning":
    case "Tip":
    case "Callout": {
      const body = children();
      const quoted = `**${CALLOUT_LABEL[node.name]}:** ${body}`
        .split("\n")
        .map((l) => (l ? `> ${l}` : ">"))
        .join("\n");
      return quoted;
    }
    case "Steps":
    case "Columns":
    case "Cards":
      return children() || "\n";
    case "Step": {
      const steps = (parent?.children ?? []).filter(
        (c) => (c.type === "mdxJsxFlowElement" || c.type === "mdxJsxTextElement") && c.name === "Step",
      );
      const n = steps.indexOf(node) + 1;
      const title = attr(node, "title");
      const heading = `**Step ${n}${title ? `: ${title}` : ""}**`;
      const body = children();
      return body ? `${heading}\n\n${body}` : heading;
    }
    case "Card": {
      const title = attr(node, "title") ?? "";
      const href = attr(node, "href");
      const body = children().replace(/\s*\n\s*/g, " ");
      const label = href ? `[${title}](${href})` : `**${title}**`;
      return `- ${label}${body ? `: ${body}` : ""}`;
    }
    case "YouTube": {
      const id = attr(node, "id");
      if (!id) return "\n";
      const title = attr(node, "title") ?? "Video";
      const caption = attr(node, "caption");
      return `Video: [${title}](https://www.youtube.com/watch?v=${id})${caption ? `\n\n${caption}` : ""}`;
    }
    default:
      // Unknown component: keep its text content.
      return children() || "\n";
  }
}

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: {
        headingIds: false,
        stringify: stringifyComponent,
      },
    },
    lastModified: async (filePath) => (await loadGitDates()).get(path.resolve(filePath)) ?? null,
  },
});

export default defineConfig({
  mdxOptions: {},
});
