// Turns raw stand-in media (media-src/) into web-ready sources in src/assets/media/.
// next/image then serves AVIF/WebP at responsive sizes from these.
// Usage: node scripts/process-media.mjs
// To use real photography later: drop the file into src/assets/media/ under the same
// name (or point the mapping below at it) and rerun.
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const out = path.resolve("src/assets/media");
mkdirSync(out, { recursive: true });

// slot file → [source, max long edge]
const map = {
  "hero.jpg": ["media-src/generated/g01-dawn-land.png", 2752],
  "hero-dusk.jpg": ["media-src/generated/g08-dusk-land.png", 2752],
  "detail-wall.jpg": ["media-src/generated/g04-plaster-shadow.png", 2400],
  "canopy.jpg": ["media-src/stock/s02-canopy.jpg", 2200],
  "terrain.jpg": ["media-src/generated/g07-terrain-model.png", 2400, "media-src/stock/s03-aerial-land-alt.jpg"],
  "land-aerial.jpg": ["media-src/generated/g05-land-aerial.png", 2048],
  "survey-stone.jpg": ["media-src/generated/g02-survey-stone.png", 2200],
  "courtyard.jpg": ["media-src/generated/g06-courtyard.png", 2200],
  "bengaluru.jpg": ["media-src/stock/s09-bengaluru.jpg", 2400],
  "dev-krishnappa.jpg": ["media-src/stock/s06-residential-aerial.jpg", 2200],
  "dev-sai.jpg": ["media-src/stock/s08-street-trees.jpg", 2200],
  "dev-srirama.jpg": ["media-src/stock/s05-earth.jpg", 2200],
  "dev-commercial.jpg": ["media-src/stock/s07-commercial.jpg", 2200],
  "dev-more.jpg": ["media-src/stock/s09-bengaluru.jpg", 2200],
};

for (const [name, [src, max, fallback]] of Object.entries(map)) {
  const from = existsSync(src) ? src : fallback && existsSync(fallback) ? fallback : null;
  if (!from) {
    console.log("skip (missing)", name, src);
    continue;
  }
  const info = await sharp(from)
    .rotate()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(path.join(out, name));
  console.log(name.padEnd(20), "←", from.padEnd(48), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
