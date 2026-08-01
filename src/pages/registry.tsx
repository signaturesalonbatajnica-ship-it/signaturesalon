import type { ComponentType } from "react";
import { pages as manifest } from "../pages-manifest";
import { Home } from "./home";
import { About } from "./about";

const components: Record<string, ComponentType> = {
  home: Home,
  about: About,
};

export const pages = manifest.map((p) => ({
  ...p,
  Component: components[p.entry],
}));
