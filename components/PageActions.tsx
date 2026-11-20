"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

const BUTTON = buttonVariants({
  color: "secondary",
  size: "sm",
  className: "gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground",
});

/**
 * "Copy page" and "View as Markdown" under a docs page's title. Both use the
 * page's Markdown version (/docs/<slug>.md), the same text the page shows.
 */
export function PageActions({ markdownUrl }: { markdownUrl: string }) {
  const [loading, setLoading] = useState(false);
  const [copied, onCopy] = useCopyButton(async () => {
    setLoading(true);
    try {
      const text = fetch(markdownUrl).then((res) => res.text());
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": text })]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 border-b pb-6">
      <button type="button" className={BUTTON} onClick={onCopy} disabled={loading}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? "Copied" : "Copy page"}
      </button>
      <a className={BUTTON} href={markdownUrl}>
        <FileText aria-hidden="true" />
        View as Markdown
      </a>
    </div>
  );
}
