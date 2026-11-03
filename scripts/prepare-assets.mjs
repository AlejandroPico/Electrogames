import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
const root = new URL("../", import.meta.url);
mkdirSync(new URL("public/icons/", root), { recursive: true });
const svg = readFileSync(new URL("favicon.svg", root), "utf8");
for (const size of [192, 512])
  writeFileSync(
    new URL(`public/icons/icon-${size}.png`, root),
    new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng(),
  );
const maskable = svg
  .replace('viewBox="0 0 64 64"', 'viewBox="-12 -12 88 88"')
  .replace(
    '<rect width="64" height="64" rx="10" fill="#203746"/>',
    '<rect x="-12" y="-12" width="88" height="88" fill="#203746"/>',
  );
writeFileSync(
  new URL("public/icons/maskable-512.png", root),
  new Resvg(maskable, { fitTo: { mode: "width", value: 512 } })
    .render()
    .asPng(),
);
mkdirSync(new URL("public/", root), { recursive: true });
for (const name of ["favicon.svg", "favicon.esvg"])
  copyFileSync(new URL(name, root), new URL(`public/${name}`, root));
