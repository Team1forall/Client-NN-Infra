// Builds every web-ready image from the sources in media-src/.
// Usage: node scripts/process-media.mjs
//
// Project N imagery is cut from the client's marketing collage
// (media-src/client/project-n-collage.jpg, 1280×853). Crops + resampling only:
// nothing is painted over or generated, so the building is never altered.
// When full-resolution renders arrive, drop them into src/assets/media under the
// same names (project-n-front.jpg etc.) and remove the matching crop below.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const media = path.resolve("src/assets/media");
const brandDir = path.resolve("src/assets/brand");
mkdirSync(media, { recursive: true });
mkdirSync(brandDir, { recursive: true });

// ---- 1. Project N renders: crops from the collage, upscaled 2× (Lanczos) with a light sharpen
const collage = "media-src/client/project-n-collage.jpg";
const crops = {
  "project-n-front.jpg": { left: 225, top: 96, width: 853, height: 417 }, // main elevation, no text overlays
  "project-n-aerial.jpg": { left: 0, top: 517, width: 447, height: 291 },
  "project-n-entrance.jpg": { left: 452, top: 517, width: 339, height: 291 },
};
if (existsSync(collage)) {
  for (const [name, box] of Object.entries(crops)) {
    const info = await sharp(collage)
      .extract(box)
      .resize({ width: box.width * 2, kernel: "lanczos3" })
      .sharpen({ sigma: 0.6 })
      .jpeg({ quality: 88, mozjpeg: true, progressive: true })
      .toFile(path.join(media, name));
    console.log(name.padEnd(24), `${info.width}x${info.height}`);
  }
}

// ---- 2. Atmospheric / illustrative images (AI-generated with Nano Banana)
const plain = {
  "land.jpg": ["media-src/generated/g01-dawn-land.png", 2752],
  "survey-stone.jpg": ["media-src/generated/g02-survey-stone.png", 2200],
};
for (const [name, [src, max]] of Object.entries(plain)) {
  if (!existsSync(src)) continue;
  const info = await sharp(src)
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(path.join(media, name));
  console.log(name.padEnd(24), `${info.width}x${info.height}`);
}

// ---- 3. Company logo (client-supplied): white background → transparency, then favicons
const logoSrc = "media-src/client/nethravathi-group-logo.png";
if (existsSync(logoSrc)) {
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
  console.log("logo".padEnd(24), `${logo.info.width}x${logo.info.height}`);

  // Bars-only mark on white for favicons
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
  console.log("favicons".padEnd(24), "icon.png, apple-icon.png, favicon.ico");
}
