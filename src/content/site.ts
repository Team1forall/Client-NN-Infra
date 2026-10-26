/**
 * Single source of truth for every fact and line of copy on the site.
 * Only confirmed information lives here. Anything not yet confirmed is
 * `null` or rendered as "To be announced" — never guessed.
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const company = {
  name: "NN Infra",
  group: "Nethravathi Group",
  venture: "A Nethravathi Group venture",
  tagline: "Legacy. Design. Delivery.",
  northStar: ["A legacy rooted in land.", "A vision designed for what comes next."],
  founded: 1986,
  founder: "Mr. B. K. Nagabhushana Reddy",
  founderShort: "B. K. Nagabhushana Reddy",
  chairman: "Mr. Jayanth N",
  chairmanShort: "Jayanth N",
  chairmanRole: "Chairman and Director",
  belief: "Everyone deserves a piece of land they can call their own.",
  commercialSqFt: "1,000,000+",
  layouts: ["Krishnappa Reddy Layout", "Sai Layout", "Sri Rama Layout"],
} as const;

export const project = {
  name: "Project N",
  city: "Bengaluru",
  state: "Karnataka",
  announcement: "January 2027",
  announcementShort: "Jan 2027",
  status: "Upcoming",
  /** Bengaluru city centre — used only as a city annotation, never as the site location. */
  cityCoordinates: "12.97° N  77.59° E",
} as const;

/** Rows for the scannable fact sheet. `value: null` renders as "To be announced". */
export const projectFacts: { label: string; value: string | null; note?: string }[] = [
  { label: "Project", value: "Project N" },
  { label: "Developer", value: "NN Infra, a Nethravathi Group venture" },
  { label: "City", value: "Bengaluru, Karnataka" },
  { label: "Announcement", value: "January 2027" },
  { label: "Status", value: "Upcoming" },
  { label: "Ownership", value: "Limited fractional ownership opportunities", note: "Details on request" },
  { label: "Site location", value: null },
  { label: "Project type & configuration", value: null },
  { label: "Regulatory registration", value: null },
];

/**
 * PLACEHOLDERS — replace before launch. Set a value to a string to publish it;
 * leave `null` to show the marked placeholder.
 */
export const contact = {
  phone: null as string | null, // e.g. "+91 80 0000 0000"
  email: null as string | null, // e.g. "projectn@nninfra.in"
  whatsapp: null as string | null, // digits only with country code, e.g. "918000000000"
  address: {
    lines: ["270/4, 1st Cross Road", "Krishna Reddy Layout", "Bengaluru 560068", "Karnataka, India"],
    mapUrl: "https://maps.app.goo.gl/pHw9cSnvWTrxh3t17",
  },
};

export const nav = [
  { href: "#project-n", label: "Project N" },
  { href: "#ownership", label: "Ownership" },
  { href: "#legacy", label: "Legacy" },
  { href: "#leadership", label: "Leadership" },
  { href: "#developments", label: "Developments" },
] as const;

export const hero = {
  lead: "A new project in Bengaluru from NN Infra, a Nethravathi Group venture that has been developing land since 1986.",
  primaryCta: "Register your interest",
  secondaryCta: "Discover Project N",
};

export const projectIntro = {
  heading: ["Every survey starts", "with a north point."],
  body: [
    "On a land survey, one mark orients everything else: N. Project N is NN Infra’s new project in Bengaluru, and the point its next chapter is drawn from.",
    "It brings four decades of land development together with a contemporary approach to design, sustainability and lifestyle.",
  ],
  pending:
    "Project details are being finalised ahead of the January 2027 announcement. Register your interest to receive them as they are released.",
};

export const ownership = {
  heading: ["Limited fractional", "ownership."],
  body: [
    "The Project N material refers to a limited number of fractional ownership opportunities. Fractional ownership generally means holding a share of a property alongside other owners.",
    "How it will work for Project N, including the structure, terms, eligibility and documentation, is still being finalised. We would rather explain it properly than summarise it here.",
  ],
  receiveTitle: "When you request details, you receive",
  receive: [
    "How the ownership structure works",
    "The terms, documents and timelines",
    "A conversation with the NN Infra team",
  ],
  cta: "Request ownership details",
  disclaimer:
    "Nothing on this website is an offer to sell, a solicitation of investment or a promise of returns. Ownership interests can carry risk. Terms, availability and any regulatory registrations will be set out in the official project documentation.",
};

export const legacy = {
  heading: ["Since 1986,", "on the ground."],
  intro:
    "Before Project N there was a belief: that everyone deserves a piece of land they can call their own. Nethravathi Group was founded on it in 1986, and has spent four decades turning open land into places to live and work.",
  stations: [
    {
      id: "founding",
      marker: "1986",
      title: "The founding",
      text: "Mr. B. K. Nagabhushana Reddy establishes Nethravathi Group with a simple conviction: everyone deserves a piece of land they can call their own.",
    },
    {
      id: "layouts",
      marker: "Layouts",
      title: "Residential layouts",
      text: "Krishnappa Reddy Layout, Sai Layout, Sri Rama Layout and more: land planned and plotted for homes.",
    },
    {
      id: "commercial",
      marker: "1M+",
      title: "Commercial development",
      text: "More than one million square feet of commercial development.",
    },
    {
      id: "today",
      marker: "Today",
      title: "The next generation",
      text: "Mr. Jayanth N, Chairman and Director, carries the legacy forward with a modern approach to real estate, design, sustainability and lifestyle creation, as NN Infra.",
    },
    {
      id: "project-n",
      marker: "2027",
      title: "Project N",
      text: "A new project in Bengaluru, announcing January 2027.",
    },
  ],
};

export const leadership = {
  heading: ["Two generations,", "one line."],
  people: [
    {
      id: "founder",
      name: "B. K. Nagabhushana Reddy",
      honorific: "Mr.",
      role: "Founder, Nethravathi Group",
      monogram: "BKN",
      since: "1986",
      text: "Established Nethravathi Group in 1986 on the belief that everyone deserves a piece of land they can call their own.",
    },
    {
      id: "chairman",
      name: "Jayanth N",
      honorific: "Mr.",
      role: "Chairman and Director",
      monogram: "JN",
      since: "Today",
      text: "Carrying the legacy forward with a modern approach to real estate, design, sustainability and lifestyle creation.",
    },
  ],
  principles: [
    { word: "Legacy.", text: "A 1986 conviction about land ownership, and four decades of layouts and commercial spaces behind it." },
    { word: "Design.", text: "A modern approach to real estate, design, sustainability and lifestyle creation." },
    { word: "Delivery.", text: "Residential layouts and more than one million square feet of commercial development." },
  ],
};

export const developments = {
  heading: ["Ground already", "covered."],
  intro: "The record behind Project N: residential layouts and commercial development by Nethravathi Group.",
  items: [
    { id: "krishnappa", name: "Krishnappa Reddy Layout", type: "Residential layout", figure: null },
    { id: "sai", name: "Sai Layout", type: "Residential layout", figure: null },
    { id: "srirama", name: "Sri Rama Layout", type: "Residential layout", figure: null },
    { id: "commercial", name: "Commercial development", type: "Commercial spaces", figure: "1,000,000+ sq ft" },
    { id: "more", name: "And more", type: "Across four decades", figure: null },
  ],
} as const;

export const enquiry = {
  heading: ["Be among the first", "to know Project N."],
  body: "Leave your details and the NN Infra team will share Project N information as it is released, including fractional ownership details if you ask for them.",
  interests: [
    { value: "project-updates", label: "Project N updates" },
    { value: "ownership", label: "Fractional ownership details" },
    { value: "both", label: "Both" },
  ],
  privacy:
    "We use your details only to respond to your enquiry about Project N. We do not sell or share them.",
  submit: "Register interest",
};

export const legal = {
  disclaimer:
    "Imagery is representative. Project information is indicative, subject to change and does not constitute an offer.",
  copyright: "© 2026 NN Infra. All rights reserved.",
};
