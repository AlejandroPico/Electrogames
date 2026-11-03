import { copyFileSync, mkdirSync } from "node:fs";
const root = new URL("../", import.meta.url);
mkdirSync(new URL("public/", root), { recursive: true });
for (const name of ["favicon.svg", "favicon.esvg"])
  copyFileSync(new URL(name, root), new URL(`public/${name}`, root));
