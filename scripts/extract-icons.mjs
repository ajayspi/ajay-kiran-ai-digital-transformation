// One-shot: dump lucide icon node data for the icons this site uses.
// ponytail: run once, paste the output into src/components/Icon.astro, delete this.
import { pathToFileURL } from "node:url";

const WANT = ["mail", "phone", "external-link", "link", "git-fork", "chevron-down", "zap",
  "brain", "trending-up", "layers", "star", "globe", "award", "users", "target", "cpu",
  "home", "circle-user-round", "briefcase", "folder-open", "chart-column-big"];

const dir = "node_modules/lucide-react/dist/esm/icons";
const out = {};
for (const name of WANT) {
  try {
    const mod = await import(pathToFileURL(`${process.cwd()}/${dir}/${name}.mjs`).href);
    // strip lucide's internal keys — only the SVG attrs matter
    out[name] = mod.__iconNode.map(([tag, attrs]) => [tag, Object.fromEntries(
      Object.entries(attrs).filter(([k]) => k !== "key"),
    )]);
  } catch {
    /* icon renamed upstream */
  }
}
console.log(JSON.stringify(out));
console.error("missing:", WANT.filter((n) => !(n in out)).join(", ") || "none");
