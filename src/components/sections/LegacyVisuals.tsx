import { MediaFrame } from "@/components/ui/MediaFrame";
import { media, type Media } from "@/content/media";
import type { legacy } from "@/content/site";

export type TopicId = (typeof legacy.topics)[number]["id"];

/** One image per legacy topic. Every image keeps its own corner tag. */
const VISUALS: Record<TopicId, Media> = {
  founding: media.legacyFounding,
  krishnappa: media.legacyKrishnappa,
  sai: media.legacySai,
  srirama: media.legacySrirama,
  commercial: media.legacyCommercial,
  today: media.projectEntrance,
  "project-n": media.projectFront,
};

/** The visual for one legacy topic (the Legacy section animates its frame). */
export function LegacyVisual({ id, sizes }: { id: TopicId; sizes: string }) {
  return <MediaFrame media={VISUALS[id]} sizes={sizes} marks={false} />;
}
