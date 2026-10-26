// Dev utility: capture screenshots of the running site with headless Chrome (no extra deps).
// Usage: node scripts/shoot.mjs --url http://localhost:3000 --out shots \
//          --sizes 1440x900,390x844 --at 0,0.5,1,2 [--sel "#legacy"] [--reduced] [--full]
// --at  scroll stops in viewport heights. --sel scrolls to elements instead (comma list).
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, []),
);
const url = args.url || "http://localhost:3000";
const out = path.resolve(args.out || "shots");
const sizes = String(args.sizes || "1440x900").split(",").map((s) => s.split("x").map(Number));
const stops = String(args.at || "0").split(",").map(Number);
const sels = args.sel ? String(args.sel).split(",") : null;
const wait = Number(args.wait || 1600);
mkdirSync(out, { recursive: true });

const chromePaths = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const chrome = chromePaths.find((p) => existsSync(p));
const port = 9300 + Math.floor(Math.random() * 400);
const profile = path.join(os.tmpdir(), `nn-shoot-${port}`);
const proc = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = list.find((t) => t.type === "page");
    if (page) {
      ws = new WebSocket(page.webSocketDebuggerUrl);
      break;
    }
  } catch {}
  await sleep(150);
}
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const logs = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    logs.push("EXCEPTION " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
  } else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    logs.push(msg.params.type.toUpperCase() + " " + msg.params.args.map((a) => a.value ?? a.description).join(" "));
  } else if (msg.method === "Log.entryAdded" && ["error", "warning"].includes(msg.params.entry.level)) {
    logs.push("LOG " + msg.params.entry.level + " " + msg.params.entry.text + " " + (msg.params.entry.url || ""));
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const mid = ++id;
    pending.set(mid, resolve);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
if (args.reduced) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

for (const [w, h] of sizes) {
  const mobile = w < 768;
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
  await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
  await send("Page.navigate", { url });
  await sleep(wait + 1200);
  await evaluate("document.documentElement.style.scrollBehavior = 'auto'");
  const overflow = await evaluate("document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0");
  if (overflow) logs.push(`OVERFLOW at ${w}px: scrollWidth=${overflow}`);
  const targets = sels
    ? sels.map((s) => ({ name: s.replace(/[^a-z0-9]+/gi, ""), js: `document.querySelector(${JSON.stringify(s)})?.getBoundingClientRect().top + scrollY` }))
    : stops.map((s) => ({ name: `y${s}`, js: `${s} * innerHeight` }));
  for (const t of targets) {
    const y = await evaluate(t.js);
    await evaluate(`window.scrollTo(0, ${Math.round(y || 0)})`);
    if (args["hide-overlay"]) await evaluate("document.querySelectorAll('nextjs-portal').forEach((n) => n.remove())");
    await sleep(wait);
    let shot;
    if (args.full) {
      const height = await evaluate("document.documentElement.scrollHeight");
      shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height, scale: 1 } });
    } else {
      shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
    }
    const file = path.join(out, `${w}x${h}-${t.name}${args.reduced ? "-reduced" : ""}.jpg`);
    writeFileSync(file, Buffer.from(shot.result.data, "base64"));
    console.log(file);
  }
}
if (logs.length) console.log("--- console/errors ---\n" + [...new Set(logs)].join("\n"));
ws.close();
proc.kill();
