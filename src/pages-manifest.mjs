// Single source of truth for the page list.
// Plain .mjs so rspack.config.mjs (plain Node) can import it too.
export const pages = [
  { path: "/", entry: "home" },
  { path: "/about/", entry: "about" },
];
