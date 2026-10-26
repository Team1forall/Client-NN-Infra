/**
 * Single source of truth for every fact and line of copy on the site.
 * Sources: the client's company copy (Oct 2026) and the client's Project N
 * marketing image. Nothing here is invented; unknowns are left out.
 */

/**
 * Public site URL (metadata, sitemap, QR code). Server-side only.
 * Order: explicit NEXT_PUBLIC_SITE_URL → Vercel's production domain (custom domain
 * once one is primary, otherwise *.vercel.app) → local dev.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000")
).replace(/\/$/, "");

export const company = {
  name: "NN Infra",
  group: "Nethravathi Group",
  venture: "Part of the Nethravathi Group venture",
  tagline: "Legacy. Design. Delivery.",
  founded: 1986,
  founder: "Mr. B K Nagabhushana Reddy",
  chairman: "Mr. Jayanth N",
  chairmanRole: "Chairman & Director",
  belief: "Everyone deserves a piece of land they can call their own.",
} as const;

export const project = {
  name: "Project N",
  type: "Premium residential apartments",
  city: "Bengaluru",
  launch: "January 2027",
  status: "Launching January 2027",
} as const;

/** Key facts, as given on the client's Project N image. */
export const projectFacts = [
  { label: "Land area", value: "20,000 sq ft" },
  { label: "Homes", value: "20 premium homes" },
  { label: "Floors", value: "G+4" },
  { label: "Configuration", value: "3 & 4 BHK" },
  { label: "Location", value: "Bengaluru" },
  { label: "Launch", value: "January 2027" },
] as const;

export const projectAmenities = [
  "Private lifts",
  "Landscaped gardens",
  "Club lounge",
  "Children’s play area",
  "24x7 security",
  "Power backup",
  "CCTV surveillance",
] as const;

export const projectGlance = {
  heading: "Project N at a glance",
  intro: "Secure, private and exclusive homes, built for elegant living.",
  ownership: "Limited fractional ownership positions open in 2027.",
};

/** Contact details supplied by the client. */
export const contact = {
  phone: { display: "+91 81976 66839", href: "tel:+918197666839" },
  whatsapp: {
    display: "+91 94480 63384",
    href: "https://wa.me/919448063384?text=" + encodeURIComponent("Hello NN Infra, I would like to know more about Project N."),
  },
  email: { display: "nethravathigroupinfo@gmail.com", href: "mailto:nethravathigroupinfo@gmail.com?subject=Project%20N%20enquiry" },
  address: {
    lines: ["270/4, 1st Cross Road", "Krishna Reddy Layout", "Bengaluru 560068", "Karnataka, India"],
    mapUrl: "https://maps.app.goo.gl/pHw9cSnvWTrxh3t17",
  },
};

export const seo = {
  title: `${project.name} by ${company.name} | Premium 3 & 4 BHK Apartments in ${project.city}`,
  description: `${project.name} by ${company.name}: premium 3 & 4 BHK residential apartments in ${project.city}, launching ${project.launch}. 20 homes on 20,000 sq ft, from a Nethravathi Group venture building since ${company.founded}.`,
  keywords: [
    "NN Infra",
    "Project N",
    "Nethravathi Group",
    "premium apartments Bengaluru",
    "3 BHK apartments Bengaluru",
    "4 BHK apartments Bengaluru",
    "new residential project Bengaluru",
    "luxury apartments Bengaluru 2027",
    "real estate developer Bengaluru",
    "residential layouts Karnataka",
    "fractional ownership Bengaluru",
  ],
} as const;

export const nav = [
  { href: "#project-n", label: "Project N" },
  { href: "#legacy", label: "Legacy" },
  { href: "#leadership", label: "Leadership" },
  { href: "#developments", label: "Developments" },
  { href: "#contact", label: "Contact" },
] as const;

export const hero = {
  primaryCta: "Enquire now",
  secondaryCta: "Explore Project N",
};

export const legacy = {
  heading: "A legacy built on land, led by vision.",
  intro: "From one man’s dream to a generational mission.",
  /** Each topic has its own visual (see Legacy section). Years only where the client gave them. */
  topics: [
    {
      id: "founding",
      marker: "1986",
      title: "Nethravathi Group is founded",
      text: "Mr. B K Nagabhushana Reddy sets out with a belief that would define his life’s work, and establishes Nethravathi Group.",
    },
    {
      id: "krishnappa",
      marker: "First project",
      title: "Krishnappa Reddy Layout",
      text: "A 51-plot residential layout that delivered more than land: dignity, belonging and hope.",
    },
    {
      id: "sai",
      marker: "2004",
      title: "Sai Layout",
      text: "220 residential plots, with an inbuilt school, because community meant education too.",
    },
    {
      id: "srirama",
      marker: "2004–05",
      title: "Sri Rama Layout",
      text: "Over 400 residential plots, expanding the group’s impact even further.",
    },
    {
      id: "commercial",
      marker: "2015–2020",
      title: "1 million+ sq ft of commercial space",
      text: "Commercial development that helped shape the business infrastructure of Karnataka.",
    },
    {
      id: "today",
      marker: "Today",
      title: "NN Infra, led by Mr. Jayanth N",
      text: "The vision lives on through his son, Mr. Jayanth N, Chairman & Director: a shift from layout development to lifestyle creation.",
    },
    {
      id: "project-n",
      marker: "2027",
      title: "The next chapter: Project N",
      text: "Premium residential apartments in Bengaluru, launching January 2027.",
    },
  ],
} as const;

export const quote = {
  text: "Everyone deserves a piece of land they can call their own.",
  name: "Mr. B K Nagabhushana Reddy",
  role: "Founder, Nethravathi Group · 1986",
};

export const leadership = {
  heading: "Leadership",
  intro: "That vision lives on, not in memory, but in motion.",
  people: [
    {
      id: "founder",
      name: "Mr. B K Nagabhushana Reddy",
      role: "Founder, Nethravathi Group",
      text: "In 1986 he established Nethravathi Group and completed its first project, Krishnappa Reddy Layout. His was purpose-driven work, focused on people, families and futures.",
    },
    {
      id: "chairman",
      name: "Mr. Jayanth N",
      role: "Chairman & Director, NN Infra",
      text: "Jayanth grew up watching not just buildings rise, but values take root. He leads with a modern, future-forward mindset, blending design sensibility, sustainability and strategic vision into every brick and plan.",
    },
  ],
} as const;

export const developments = {
  heading: "Developments",
  intro: "Planned with curation, built with integrity, delivered with trust.",
  featured: {
    name: "Project N",
    status: "Upcoming · Launching January 2027",
    summary: "Premium residential apartments in Bengaluru: 20 homes across G+4 floors, in 3 & 4 BHK configurations.",
  },
  completed: [
    { name: "Krishnappa Reddy Layout", detail: "51 residential plots", year: "First project" },
    { name: "Sai Layout", detail: "220 residential plots with an inbuilt school", year: "2004" },
    { name: "Sri Rama Layout", detail: "400+ residential plots", year: "2004–05" },
    { name: "Commercial development", detail: "1 million+ sq ft of commercial space", year: "2015–2020" },
  ],
} as const;

export const enquiry = {
  heading: "Reach out to us",
  body: "We will be happy to answer your queries about Project N.",
  submit: "Submit",
  privacy: "We use your details only to respond to your enquiry.",
};

export const legal = {
  copyright: "© 2026 NN Infra. Part of the Nethravathi Group venture.",
  disclaimer: "Images are artist’s impressions. Project information is indicative and does not constitute an offer.",
};
