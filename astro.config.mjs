import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import swup from "@swup/astro";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://aniekan-akpan.github.io",
  base: "/aniekan-blog",
  integrations: [
    swup({
      theme: ["overlay", { direction: "to-top" }],
      cache: true,
      progress: true,
    }),
    react(),
    sitemap(),
  ],

  image: {
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Alias Preact to React for Tina compatibility
        'preact': 'react',
        'preact/hooks': 'react',
        'preact/jsx-runtime': 'react/jsx-runtime',
        'preact/jsx-dev-runtime': 'react/jsx-dev-runtime',
      },
    },
  },
});

//swup theme variations:
// theme: "fade"
// theme: ["overlay", { direction: "to-top"}]
//
// for overlay and fade, further customization can be done in animate.css file
// To know about swup, visit https://swup.js.org/
