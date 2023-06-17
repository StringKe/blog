import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";

import { SITE } from "./src/config";

// https://astro.build/config
export default /** @type {import("astro").AstroUserConfig} */ defineConfig({
  site: SITE.website,
  compressHTML: true,
  output: "static",
  integrations: [
    react(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypeToc, { headings: ["h1", "h2", "h3"], nav: true }],
      rehypeSlug,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    smartypants: true,
    gfm: true,
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
