import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
const root = "https://example.test/Electrogames/",
  source = await readFile("dist/sw.js", "utf8"),
  manifest = JSON.parse(await readFile("dist/manifest.webmanifest", "utf8"));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.scope, "./");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.name, "ElectroGames");
for (const icon of manifest.icons.filter((i) => i.type === "image/png")) {
  const data = await readFile("dist/" + icon.src),
    size = Number(icon.sizes.split("x")[0]);
  assert.equal(data.subarray(1, 4).toString(), "PNG");
  assert.equal(data.readUInt32BE(16), size);
  assert.equal(data.readUInt32BE(20), size);
}
assert.equal(
  await readFile("favicon.svg", "utf8"),
  await readFile("dist/favicon.svg", "utf8"),
);
const stores = new Map(),
  handlers = new Map();
let online = true,
  claimed = false;
const key = (r) => (typeof r === "string" ? r : r.url);
const network = async (r) => {
  if (!online) throw Error("offline");
  const url = new URL(key(r));
  assert.ok(url.href.startsWith(root));
  const relative = url.href.slice(root.length) || "index.html";
  assert.ok(!relative.includes(".."));
  return new Response(await readFile(path.join("dist", relative)));
};
const caches = {
  open: async (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      addAll: async (urls) => {
        for (const url of urls) store.set(url, await network(url));
      },
      match: async (r) => store.get(key(r))?.clone(),
    };
  },
  keys: async () => [...stores.keys()],
  delete: async (name) => stores.delete(name),
};
vm.runInNewContext(source, {
  URL,
  caches,
  fetch: network,
  self: {
    location: { href: root + "sw.js", origin: new URL(root).origin },
    clients: {
      claim: async () => {
        claimed = true;
      },
    },
    addEventListener: (name, fn) => handlers.set(name, fn),
  },
});
await caches.open("electrogames-offline-obsolete");
await caches.open("games-offline-another-project");
for (const event of ["install", "activate"]) {
  let task;
  handlers.get(event)({ waitUntil: (p) => (task = p) });
  await task;
}
assert.equal(claimed, true);
assert.equal(stores.has("electrogames-offline-obsolete"), false);
assert.equal(stores.has("games-offline-another-project"), true);
online = false;
const urls = [...stores.entries()].find(([name]) =>
  name.startsWith("electrogames-offline-"),
)[1];
for (const url of urls.keys()) {
  let response;
  handlers.get("fetch")({
    request: { url, method: "GET", mode: "cors" },
    respondWith: (p) => (response = p),
  });
  assert.ok(await response, "Cached resource " + url);
}
let navigation;
handlers.get("fetch")({
  request: { url: root, method: "GET", mode: "navigate" },
  respondWith: (p) => (navigation = p),
});
assert.match(await (await navigation).text(), /id="root"/);
let sibling = false;
handlers.get("fetch")({
  request: {
    url: "https://example.test/Games/",
    method: "GET",
    mode: "navigate",
  },
  respondWith: () => (sibling = true),
});
assert.equal(sibling, false);
console.log(
  `PWA verificada: ${urls.size} recursos, iconos, navegación sin conexión y caché aislada.`,
);
