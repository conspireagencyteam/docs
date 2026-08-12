import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

// Docs are mounted at the site root so URLs match the old Mintlify site
// (e.g. /bundles/single-product).
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});
