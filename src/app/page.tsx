import { ScrollFx } from "@/components/motion/ScrollFx";
import { Developments } from "@/components/sections/Developments";
import { Enquire } from "@/components/sections/Enquire";
import { Hero } from "@/components/sections/Hero";
import { Leadership } from "@/components/sections/Leadership";
import { Legacy } from "@/components/sections/Legacy";
import { ProjectN } from "@/components/sections/ProjectN";
import { Quote } from "@/components/sections/Quote";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { company, contact, seo, siteUrl } from "@/content/site";

/** Structured data: the company, its office and contact points. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: company.name,
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  image: `${siteUrl}/opengraph-image`,
  description: seo.description,
  parentOrganization: { "@type": "Organization", name: company.group, foundingDate: String(company.founded) },
  telephone: contact.phone.href.replace("tel:", ""),
  email: contact.email.display,
  address: {
    "@type": "PostalAddress",
    streetAddress: "270/4, 1st Cross Road, Krishna Reddy Layout",
    addressLocality: "Bengaluru",
    postalCode: "560068",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  areaServed: "Bengaluru",
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProjectN />
        <Legacy />
        <Quote />
        <Leadership />
        <Developments />
        <Enquire />
      </main>
      <Footer />
      <ScrollFx />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
    </>
  );
}
