// Creates soft palette placeholder images for every media slot that doesn't exist yet,
// so the site builds before real media arrive. Never overwrites an existing file.
// Usage: node scripts/make-placeholders.mjs
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("src/assets/media");
mkdirSync(dir, { recursive: true });

const slots = {
  "hero.jpg": [2400, 1350],
  "hero-dusk.jpg": [2400, 1350],
  "detail-wall.jpg": [2400, 1350],
  "canopy.jpg": [1600, 2133],
  "terrain.jpg": [2400, 1350],
  "land-aerial.jpg": [2000, 2000],
  "survey-stone.jpg": [1600, 2000],
  "courtyard.jpg": [1600, 2000],
  "bengaluru.jpg": [2400, 1600],
  "dev-krishnappa.jpg": [1800, 2400],
  "dev-sai.jpg": [1800, 2400],
  "dev-srirama.jpg": [1800, 2400],
  "dev-commercial.jpg": [1800, 2400],
  "dev-more.jpg": [1800, 2400],
};

for (const [name, [w, h]] of Object.entries(slots)) {
  const out = path.join(dir, name);
  if (existsSync(out)) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E9EEDF"/><stop offset=".55" stop-color="#B9C9AF"/><stop offset="1" stop-color="#35483A"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toFile(out);
  console.log("placeholder", name);
}
