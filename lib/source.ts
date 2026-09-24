import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

// Docs are mounted at /docs so the site root can carry the marketing pages
// (getbonde.com). The old root-mounted URLs (docs.getbonde.com/bundles/…) are
// rewritten/redirected in next.config.mjs.
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
