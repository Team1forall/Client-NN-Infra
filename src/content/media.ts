import type { StaticImageData } from "next/image";

import projectFront from "@/assets/media/project-n-front.jpg";
import projectAerial from "@/assets/media/project-n-aerial.jpg";
import projectEntrance from "@/assets/media/project-n-entrance.jpg";
import land from "@/assets/media/land.jpg";
import surveyStone from "@/assets/media/survey-stone.jpg";
import legacyFounding from "@/assets/media/legacy-founding.jpg";
import legacyKrishnappa from "@/assets/media/legacy-krishnappa.jpg";
import legacySai from "@/assets/media/legacy-sai.jpg";
import legacySrirama from "@/assets/media/legacy-srirama.jpg";
import legacyCommercial from "@/assets/media/legacy-commercial.jpg";
import devKrishnappa from "@/assets/media/dev-krishnappa.jpg";
import devSai from "@/assets/media/dev-sai.jpg";
import devSrirama from "@/assets/media/dev-srirama.jpg";
import devCommercial from "@/assets/media/dev-commercial.jpg";
import leaderFounder from "@/assets/media/leader-founder.jpg";
import leaderChairman from "@/assets/media/leader-chairman.jpg";
import groupLogo from "@/assets/brand/nethravathi-group-logo.png";

export type Media = {
  src: StaticImageData;
  alt: string;
  /** Small annotation shown on the frame, or null. */
  tag: string | null;
};

const RENDER = "Artist’s impression";
const AI = "Illustrative image";

/**
 * All images are built at up to 4K by scripts/process-media.mjs.
 * Project N renders: cropped from the client's Project N image and super-resolved
 * with Real-ESRGAN (no repainting of the building).
 * Past projects: AI-generated with Nano Banana Pro (no real photos exist); always tagged.
 */
export const media = {
  projectFront: { src: projectFront, alt: "Project N at dusk: two G+4 residential towers with landscaped balconies above a timber-and-stone entrance marked Project N", tag: RENDER },
  projectAerial: { src: projectAerial, alt: "Aerial view of Project N at dusk, with rooftop gardens and tree-lined surroundings", tag: RENDER },
  projectEntrance: { src: projectEntrance, alt: "Project N entrance wall with the NN Infra and Project N name, lit water feature and paved driveway", tag: RENDER },
  /** Atmosphere behind the founder's quote. */
  land: { src: land, alt: "", tag: null },
  surveyStone: { src: surveyStone, alt: "Weathered granite boundary stone standing in red earth and dry grass", tag: AI },

  legacyFounding: { src: legacyFounding, alt: "Open land at the edge of Bengaluru marked out with boundary stones for the first plots, in early morning light", tag: AI },
  legacyKrishnappa: { src: legacyKrishnappa, alt: "Aerial view of a small residential layout of independent houses along tree-lined roads", tag: AI },
  legacySai: { src: legacySai, alt: "Aerial view of a residential layout with a school building and playground among the houses", tag: AI },
  legacySrirama: { src: legacySrirama, alt: "High aerial view of a large planned residential layout with a grid of tree-lined streets and a central park", tag: AI },
  legacyCommercial: { src: legacyCommercial, alt: "Contemporary commercial office buildings with stone and glass facades around a landscaped plaza at dusk", tag: AI },

  devKrishnappa: { src: devKrishnappa, alt: "A quiet tree-lined residential street with independent houses and compound walls", tag: AI },
  devSai: { src: devSai, alt: "A two-storey school building with a courtyard and playground inside a residential layout", tag: AI },
  devSrirama: { src: devSrirama, alt: "A wide residential avenue under a canopy of mature rain trees", tag: AI },
  devCommercial: { src: devCommercial, alt: "Facade of a contemporary commercial building with stone cladding and glass at dusk", tag: AI },
} satisfies Record<string, Media>;

/** Leadership portraits (client photographs). */
export const leaders: Record<"founder" | "chairman", Media | null> = {
  founder: { src: leaderFounder, alt: "Portrait of Mr. B K Nagabhushana Reddy in a navy suit and tie", tag: null },
  chairman: { src: leaderChairman, alt: "Portrait of Mr. Jayanth N in a dark blazer, smiling, leaning on a railing", tag: null },
};

export const brand = {
  logo: { src: groupLogo, alt: "Nethravathi Group" },
};
