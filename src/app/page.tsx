import { ScrollFx } from "@/components/motion/ScrollFx";
import { Developments } from "@/components/sections/Developments";
import { Enquire } from "@/components/sections/Enquire";
import { Hero } from "@/components/sections/Hero";
import { Leadership } from "@/components/sections/Leadership";
import { Legacy } from "@/components/sections/Legacy";
import { Quote } from "@/components/sections/Quote";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { company, contact, project, projectAmenities, projectGlance, seo, siteUrl } from "@/content/site";

/** Structured data: the site, the company with its office and contact points, and Project N. */
const address = {
  "@type": "PostalAddress",
  streetAddress: contact.address.lines.slice(0, 2).join(", "),
  addressLocality: "Bengaluru",
  postalCode: "560068",
  addressRegion: "Karnataka",
  addressCountry: "IN",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: company.name,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#org` },
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${siteUrl}/#org`,
      name: company.name,
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      image: `${siteUrl}/opengraph-image`,
      description: seo.description,
      slogan: company.tagline,
      parentOrganization: { "@type": "Organization", name: company.group, foundingDate: String(company.founded) },
      telephone: contact.phone.href.replace("tel:", ""),
      email: contact.email.display,
      address,
      hasMap: contact.address.mapUrl,
      areaServed: { "@type": "City", name: "Bengaluru" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: contact.phone.href.replace("tel:", ""),
          contactType: "sales",
          areaServed: "IN",
        },
      ],
    },
    {
      "@type": "ApartmentComplex",
      "@id": `${siteUrl}/#project-n`,
      name: project.name,
      url: `${siteUrl}/#project-n`,
      description: `${projectGlance.intro} ${project.type} in ${project.city}: 20 homes (3 & 4 BHK), G+4, on 20,000 sq ft. Launching ${project.launch}.`,
      image: `${siteUrl}/opengraph-image`,
      numberOfAccommodationUnits: 20,
      address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
      amenityFeature: projectAmenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      provider: { "@id": `${siteUrl}/#org` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
