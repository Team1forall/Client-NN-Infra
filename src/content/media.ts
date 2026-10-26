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

/**
 * Media registry. Every image is a licensed stock or AI-generated stand-in until
 * NN Infra supplies real photography — replace the file in src/assets/media and
 * update `alt` (and set `tag: null` for genuine project photographs).
 */
export const media = {
  hero: { src: hero, alt: "Open land at first light with scattered trees and low mist", tag: REP },
  heroDusk: { src: heroDusk, alt: "The same open land at dusk, mist settling under a deep green sky", tag: REP },
  detailWall: { src: detailWall, alt: "Lime-plaster wall with soft leaf shadows", tag: REP },
  canopy: { src: canopy, alt: "Looking up into a broad tree canopy with sunlight through the leaves", tag: REP },
  terrain: { src: terrain, alt: "Layered paper model of gentle terrain in sage and stone tones", tag: "Illustrative" },
  landAerial: { src: landAerial, alt: "Aerial view of open land with faint field boundaries and clusters of trees", tag: REP },
  surveyStone: { src: surveyStone, alt: "Weathered stone boundary marker set in red earth and grass", tag: REP },
  courtyard: { src: courtyard, alt: "Quiet courtyard with a single tree, stone paving and plastered walls", tag: REP },
  bengaluru: { src: bengaluru, alt: "Tree-lined Bengaluru street", tag: REP },
  devKrishnappa: { src: devKrishnappa, alt: "Aerial view of a leafy residential layout", tag: REP },
  devSai: { src: devSai, alt: "Tree-lined residential street", tag: REP },
  devSrirama: { src: devSrirama, alt: "Plotted residential land with young trees", tag: REP },
  devCommercial: { src: devCommercial, alt: "Detail of a commercial building facade", tag: REP },
  devMore: { src: devMore, alt: "Green avenue in Bengaluru", tag: REP },
} satisfies Record<string, Media>;

export const video = {
  aerial: {
    src: "/media/video/v01-aerial-green.mp4",
    srcMobile: "/media/video/v01-aerial-green-mobile.mp4",
    poster: "/media/video/v01-aerial-green-poster.jpg",
    label: "Representative footage",
  },
};
