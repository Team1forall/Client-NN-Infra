import { ScrollFx } from "@/components/motion/ScrollFx";
import { Developments } from "@/components/sections/Developments";
import { Enquire } from "@/components/sections/Enquire";
import { Hero } from "@/components/sections/Hero";
import { Leadership } from "@/components/sections/Leadership";
import { Legacy } from "@/components/sections/Legacy";
import { Ownership } from "@/components/sections/Ownership";
import { ProjectN } from "@/components/sections/ProjectN";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProjectN />
        <Ownership />
        <Legacy />
        <Leadership />
        <Developments />
        <Enquire />
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}
