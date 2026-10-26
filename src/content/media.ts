import type { StaticImageData } from "next/image";

import projectFront from "@/assets/media/project-n-front.jpg";
import projectAerial from "@/assets/media/project-n-aerial.jpg";
import projectEntrance from "@/assets/media/project-n-entrance.jpg";
import land from "@/assets/media/land.jpg";
import surveyStone from "@/assets/media/survey-stone.jpg";
import groupLogo from "@/assets/brand/nethravathi-group-logo.png";

export type Media = {
  src: StaticImageData;
  alt: string;
  /** Small annotation shown on the frame, or null. */
  tag: string | null;
};

const RENDER = "Artist’s impression";

/**
 * Project N imagery is cropped from the client's Project N marketing image
 * (media-src/client/project-n-collage.jpg) without altering the building.
 * Replace with full-resolution renders when available: same file names in
 * src/assets/media, then update `alt` if the view changes.
 */
export const media = {
  projectFront: { src: projectFront, alt: "Project N at dusk: two G+4 residential towers with landscaped balconies above a timber-and-stone entrance marked Project N", tag: RENDER },
  projectAerial: { src: projectAerial, alt: "Aerial view of Project N at dusk, with rooftop gardens and tree-lined surroundings", tag: RENDER },
  projectEntrance: { src: projectEntrance, alt: "Project N entrance wall with the NN Infra and Project N name, lit water feature and paved driveway", tag: RENDER },
  /** AI-generated landscape (Nano Banana) used only as atmosphere behind the founder's quote. */
  land: { src: land, alt: "", tag: null },
  /** AI-generated (Nano Banana): a boundary stone, illustrating the 1986 founding. */
  surveyStone: { src: surveyStone, alt: "Weathered granite boundary stone standing in red earth and dry grass", tag: "Illustrative image" },
} satisfies Record<string, Media>;

/**
 * Leadership portraits (client photographs). Until a file is added this stays
 * null and the section renders without an image, never a placeholder.
 * To add: save to src/assets/media/leader-founder.jpg / leader-chairman.jpg,
 * import it above and set { src, alt, tag: null }.
 */
export const leaders: Record<"founder" | "chairman", Media | null> = {
  founder: null,
  chairman: null,
};

export const brand = {
  logo: { src: groupLogo, alt: "Nethravathi Group" },
};
