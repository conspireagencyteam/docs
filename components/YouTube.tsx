"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Lightweight YouTube embed for docs pages (registered as `<YouTube />`
 * in components/mdx.tsx). Renders the video's poster with a play
 * button and only loads the YouTube iframe once a reader clicks, so a
 * docs page does not pay for YouTube's player scripts on load. Uses the
 * privacy-enhanced youtube-nocookie.com host, and always offers a plain
 * "Watch on YouTube" link for no-JS readers and screen readers.
 */
export function YouTube({
  id,
  title,
  caption,
  onDark = false,
  className = "my-6",
  eager = false,
}: {
  /** The YouTube video id (the `v=` value / youtu.be path). */
  id: string;
  /** Accessible name for the player and poster button. */
  title: string;
  /** Optional caption rendered under the player. */
  caption?: string;
  /** Light caption text for dark backgrounds. */
  onDark?: boolean;
  /** Figure spacing; defaults to the docs' vertical rhythm. */
  className?: string;
  /** Load the poster immediately (above-the-fold heroes). */
  eager?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  );
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <figure className={`not-prose ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-fd-border bg-black shadow-sm">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              loading={eager ? "eager" : "lazy"}
              // maxresdefault only exists for HD uploads; fall back to the
              // always-present 480p poster (object-cover trims its bars).
              onError={() => {
                const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                if (poster !== fallback) setPoster(fallback);
              }}
              className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground shadow-lg ring-4 ring-white/40 transition group-hover:scale-105 group-hover:opacity-90">
                <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption
        className={`mt-2 text-sm ${onDark ? "text-white/60" : "text-fd-muted-foreground"}`}
      >
        {caption ? `${caption} ` : null}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener"
          className={`underline underline-offset-2 ${onDark ? "hover:text-white" : "hover:text-fd-foreground"}`}
        >
          Watch on YouTube
        </a>
      </figcaption>
    </figure>
  );
}
