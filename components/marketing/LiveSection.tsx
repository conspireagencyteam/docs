import fs from "node:fs";
import path from "node:path";

/**
 * Renders one section imported from the live getbonde.com Shopify theme
 * (content/site/<page>/<NN-name>.html, produced by
 * scripts/import-live-site.py). The fragments are static, sanitised HTML we
 * authored ourselves — no user input reaches them — so innerHTML is safe here.
 * Their styling comes from app/(marketing)/live/*.css (the theme's own
 * stylesheets) and their behaviour from components/marketing/SiteScripts.tsx.
 */
const ROOT = path.join(process.cwd(), "content", "site");

export function listSections(page: string): string[] {
  return fs
    .readdirSync(path.join(ROOT, page))
    .filter((f) => f.endsWith(".html"))
    .sort();
}

export default function LiveSection({ page, file }: { page: string; file: string }) {
  const html = fs.readFileSync(path.join(ROOT, page, file), "utf8");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/** All sections of a page in order, with an optional element injected before a named section. */
export function LivePage({
  page,
  before,
}: {
  page: string;
  /** map of section name (e.g. "faq") → element to render before it */
  before?: Record<string, React.ReactNode>;
}) {
  const files = listSections(page);
  return (
    <>
      {files.map((file) => {
        const name = file.replace(/^\d+-/, "").replace(/\.html$/, "");
        return (
          <React.Fragment key={file}>
            {before?.[name]}
            <LiveSection page={page} file={file} />
          </React.Fragment>
        );
      })}
    </>
  );
}

import React from "react";
