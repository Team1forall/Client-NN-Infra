import type { StaticImageData } from "next/image";

import hero from "@/assets/media/hero.jpg";
import heroDusk from "@/assets/media/hero-dusk.jpg";
import detailWall from "@/assets/media/detail-wall.jpg";
import canopy from "@/assets/media/canopy.jpg";
import terrain from "@/assets/media/terrain.jpg";
import landAerial from "@/assets/media/land-aerial.jpg";
import surveyStone from "@/assets/media/survey-stone.jpg";
import courtyard from "@/assets/media/courtyard.jpg";
import bengaluru from "@/assets/media/bengaluru.jpg";
import devKrishnappa from "@/assets/media/dev-krishnappa.jpg";
import devSai from "@/assets/media/dev-sai.jpg";
import devSrirama from "@/assets/media/dev-srirama.jpg";
import devCommercial from "@/assets/media/dev-commercial.jpg";
import devMore from "@/assets/media/dev-more.jpg";

export type Media = {
  src: StaticImageData;
  alt: string;
  /** Annotation shown on the frame. Every stand-in is labelled. */
  tag: string | null;
};

const REP = "Representative image";
const GEN = "Illustrative image";

/**
 * Media registry. Every image is a stand-in until NN Infra supplies real
 * photography: licensed stock ("Representative image") or AI-generated with
 * Nano Banana ("Illustrative image"). See media-src/ for sources and credits.
 * To replace one, drop the real file into src/assets/media under the same name,
 * update `alt`, and set `tag: null` for genuine project photographs.
 */
export const media = {
  hero: { src: hero, alt: "Misty open land at dawn with broad rain trees and winding red-earth paths", tag: GEN },
  heroDusk: { src: heroDusk, alt: "The same open land at dusk, mist settling between the trees under a blue-green sky", tag: GEN },
  detailWall: { src: detailWall, alt: "Pale sage plaster wall with soft dappled leaf shadows and a fine horizontal line", tag: GEN },
  canopy: { src: canopy, alt: "Looking up into the spreading branches and fine leaves of a large rain tree", tag: REP },
  terrain: { src: terrain, alt: "Layered paper model of gentle terrain in sage, ivory and stone tones", tag: GEN },
  landAerial: { src: landAerial, alt: "Aerial view of red-earth land divided by faint boundaries and footpaths, with clusters of trees", tag: GEN },
  surveyStone: { src: surveyStone, alt: "Weathered granite boundary stone standing in red earth and dry grass", tag: GEN },
  courtyard: { src: courtyard, alt: "Quiet courtyard with a frangipani tree against plastered walls in warm light", tag: GEN },
  bengaluru: { src: bengaluru, alt: "Old trees with spreading branches over open grass in Cubbon Park, Bengaluru", tag: REP },
  devKrishnappa: { src: devKrishnappa, alt: "Aerial view of a residential neighbourhood laid out on a street grid with many trees", tag: REP },
  devSai: { src: devSai, alt: "Empty road under tall arching trees", tag: REP },
  devSrirama: { src: devSrirama, alt: "Red-earth track curving between grassy banks", tag: REP },
  devCommercial: { src: devCommercial, alt: "Black-and-white detail of a plain white building facade with deep-set windows", tag: REP },
  devMore: { src: devMore, alt: "Old trees over open grass in Cubbon Park, Bengaluru", tag: REP },
} satisfies Record<string, Media>;

export const video = {
  aerial: {
    src: "/media/video/v01-aerial-green.mp4",
    srcMobile: "/media/video/v01-aerial-green-mobile.mp4",
    poster: "/media/video/v01-aerial-green-poster.jpg",
    label: "Representative footage",
  },
};
