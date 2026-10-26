// TEMPORARY lead-only preview route. Delete before handoff.
import { ScrollFx } from "@/components/motion/ScrollFx";
import { Hero } from "@/components/sections/Hero";
import { Ownership } from "@/components/sections/Ownership";
import { ProjectN } from "@/components/sections/ProjectN";
import { Nav } from "@/components/site/Nav";

export default function Preview() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProjectN />
        <Ownership />
        <div style={{ height: "100vh" }} />
      </main>
      <ScrollFx />
    </>
  );
}
