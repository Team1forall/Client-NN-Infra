// Builds every web-ready image from the sources in media-src/, at 4K where the source allows.
// Usage:
//   REALESRGAN_BIN="C:/path/to/realesrgan-ncnn-vulkan.exe" node scripts/process-media.mjs
// Real-ESRGAN (https://github.com/xinntao/Real-ESRGAN, ncnn-vulkan build) does the super-resolution:
// it restores detail from the pixels that are there rather than repainting the image, so the
// Project N building is never altered. Without REALESRGAN_BIN the script falls back to Lanczos.
//
// Project N imagery is cut from the client's marketing collage (media-src/client/project-n-collage.jpg,
// 1280×853): crops + super-resolution only, nothing painted over or generated.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const media = path.resolve("src/assets/media");
const brandDir = path.resolve("src/assets/brand");
mkdirSync(media, { recursive: true });
mkdirSync(brandDir, { recursive: true });

const ESRGAN = process.env.REALESRGAN_BIN && existsSync(process.env.REALESRGAN_BIN) ? process.env.REALESRGAN_BIN : null;
const tmp = mkdtempSync(path.join(os.tmpdir(), "nn-media-"));
const TARGET = 3840; // 4K UHD width
// Optional: ONLY=legacy-,dev- limits the run to outputs whose names start with those prefixes.
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;
const wanted = (name) => !ONLY || ONLY.some((p) => name.startsWith(p));

/** Super-resolve `input` (a sharp-readable buffer or path) `passes` times at 4×. Returns a PNG path. */
function superResolve(inputPng, name, passes) {
  let current = inputPng;
  for (let i = 0; i < passes; i++) {
    const out = path.join(tmp, `${name}-sr${i}.png`);
    execFileSync(ESRGAN, ["-i", current, "-o", out, "-n", "realesrgan-x4plus", "-s", "4", "-f", "png"], {
      cwd: path.dirname(ESRGAN),
      stdio: "ignore",
    });
    current = out;
  }
  return current;
}

/** Writes a 4K-wide (or as large as sensible) JPEG from a source region. */
async function build(name, { src, crop, passes = 1, width = TARGET, maxInput }) {
  if (!wanted(name)) return;
  const base = path.join(tmp, `${name}-base.png`);
  let img = sharp(src);
  if (crop) img = img.extract(crop);
  // Large sources are supersampled: shrink to maxInput, super-resolve 4×, then resize to the target.
  if (maxInput) img = img.resize({ width: maxInput, height: maxInput, fit: "inside", withoutEnlargement: true });
  await img.png().toFile(base);
  let from = base;
  if (ESRGAN) from = superResolve(base, name, passes);
  const info = await sharp(from)
    .resize({ width, kernel: "lanczos3" })
    .jpeg({ quality: 86, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(media, name));
  console.log(name.padEnd(28), `${info.width}x${info.height}`, ESRGAN ? `(Real-ESRGAN ×${4 ** passes})` : "(Lanczos)");
}

// ---- 1. Project N renders (client collage crops)
const collage = "media-src/client/project-n-collage.jpg";
if (existsSync(collage)) {
  await build("project-n-front.jpg", { src: collage, crop: { left: 225, top: 96, width: 853, height: 417 }, passes: 1 });
  await build("project-n-aerial.jpg", { src: collage, crop: { left: 0, top: 517, width: 447, height: 291 }, passes: 2 });
  await build("project-n-entrance.jpg", { src: collage, crop: { left: 452, top: 517, width: 339, height: 291 }, passes: 2, width: 3200 });
}

// ---- 2. AI-generated imagery (Nano Banana Pro, ~2.7K) → 4K
const generated = {
  "land.jpg": "g01-dawn-land.png",
  "survey-stone.jpg": "g02-survey-stone.png",
  "legacy-founding.jpg": "l1-founding-1986.png",
  "legacy-krishnappa.jpg": "l2-krishnappa-aerial.png",
  "legacy-sai.jpg": "l3-sai-aerial.png",
  "legacy-srirama.jpg": "l4-srirama-aerial.png",
  "legacy-commercial.jpg": "l5-commercial.png",
  "dev-krishnappa.jpg": "d1-krishnappa-street.png",
  "dev-sai.jpg": "d2-sai-school.png",
  "dev-srirama.jpg": "d3-srirama-avenue.png",
  "dev-commercial.jpg": "d4-commercial-facade.png",
};
for (const [name, file] of Object.entries(generated)) {
  const src = path.join("media-src/generated", file);
  if (!existsSync(src)) continue;
  const meta = await sharp(src).metadata();
  // Portrait images get 4K on the long edge.
  const width = meta.height > meta.width ? Math.round((TARGET * meta.width) / meta.height) : TARGET;
  await build(name, { src, passes: 1, width, maxInput: 1920 });
}

// ---- 3. Leadership portraits (client photographs): crop the decorative frame, keep the photo honest
const portraits = {
  "leader-chairman.jpg": { src: "media-src/client/jayanth-n.jpg" },
  "leader-founder.jpg": { src: "media-src/client/bk-nagabhushana-reddy.jpg", trimFrame: 16 },
};
for (const [name, { src, trimFrame }] of Object.entries(portraits)) {
  if (!existsSync(src) || !wanted(name)) continue;
  const meta = await sharp(src).metadata();
  let img = sharp(src);
  if (trimFrame) img = img.extract({ left: trimFrame, top: trimFrame, width: meta.width - trimFrame * 2, height: meta.height - trimFrame * 2 });
  const info = await img.jpeg({ quality: 88, mozjpeg: true, progressive: true }).toFile(path.join(media, name));
  console.log(name.padEnd(28), `${info.width}x${info.height}`, "(original photo)");
}

// ---- 4. Company logo (client-supplied): white background → transparency, then favicons
const logoSrc = "media-src/client/nethravathi-group-logo.png";
if (existsSync(logoSrc) && wanted("logo")) {
  const { data, info } = await sharp(logoSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b, a0] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3] / 255];
    let A = Math.max(255 - r, 255 - g, 255 - b) / 255; // colour-to-alpha against white
    if (A < 0.035) A = 0;
    const un = (c) => (A > 0 ? Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - A)) / A))) : 0);
    out.set([un(r), un(g), un(b), Math.round(A * a0 * 255)], i * 4);
  }
  const png = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  const logo = await sharp(png).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  writeFileSync(path.join(brandDir, "nethravathi-group-logo.png"), logo.data);
  console.log("logo".padEnd(28), `${logo.info.width}x${logo.info.height}`);

  const bars = await sharp(logo.data)
    .extract({ left: 0, top: 0, width: logo.info.width, height: Math.round(logo.info.height * 0.69) })
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const side = Math.max(bars.info.width, bars.info.height);
  const pad = Math.round(side * 0.16);
  const square = await sharp({ create: { width: side + pad * 2, height: side + pad * 2, channels: 4, background: "#ffffff" } })
    .composite([{ input: bars.data, left: pad + Math.round((side - bars.info.width) / 2), top: pad + Math.round((side - bars.info.height) / 2) }])
    .png()
    .toBuffer();
  await sharp(square).resize(512, 512).png().toFile("src/app/icon.png");
  await sharp(square).resize(180, 180).png().toFile("src/app/apple-icon.png");
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => sharp(square).resize(s, s).png().toBuffer()));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const dirs = pngs.map((p, i) => {
    const d = Buffer.alloc(16);
    d.writeUInt8(sizes[i], 0);
    d.writeUInt8(sizes[i], 1);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(p.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += p.length;
    return d;
  });
  writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...dirs, ...pngs]));
  console.log("favicons".padEnd(28), "icon.png, apple-icon.png, favicon.ico");
}
