import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    // Mintlify served folder index pages at /<section>/index; Fumadocs serves
    // them at /<section>. Keep old inbound links working.
    return [
      {
        source: "/:section/index",
        destination: "/:section",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
