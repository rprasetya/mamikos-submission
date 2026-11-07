// Seed data served by GET /api/sections/[section]. Copy and images come from
// pxpush.com; image sizes are the real pixel dimensions (used to reserve space).

const work = (n, width) => ({
  id: `work-${n}`,
  src: `/img/works/work${n}.webp`,
  alt: "",
  width,
  height: 1400,
});

// Same order as the showcase on pxpush.com.
export const works = [
  work(2, 1502),
  work(3, 2325),
  work(4, 1423),
  work(5, 1136),
  work(1, 1467),
  work(6, 2586),
  work(7, 1239),
  work(8, 1555),
  work(9, 965),
  work(10, 1636),
  work(11, 1071),
  work(12, 1431),
  work(13, 1251),
  work(14, 1386),
  work(15, 1423),
];

const benefitImage = (n, alt) => ({ src: `/img/home/benefit${n}.webp`, alt, width: 700, height: 900 });

export const benefits = [
  {
    id: "async",
    number: "Nº001",
    title: "Totally async",
    description:
      "Don't like meetings? We don't either; the conference room has been officially retired, so all requests, decisions, and approvals move in writing through the proper operating channel.",
    image: benefitImage(1, "Totally async illustration"),
  },
  {
    id: "fixed-rate",
    number: "Nº002",
    title: "Fixed monthly rate",
    description:
      "No surprises here. Your department is retained at the same flat monthly rate, with budgeting made orderly, predictable, and free from special charges arriving in a separate envelope.",
    image: benefitImage(2, "Fixed monthly rate illustration"),
  },
  {
    id: "fast-delivery",
    number: "Nº003",
    title: "Lightning fast delivery",
    description:
      "Get your design delivered one at a time in just 72 hours on average, keeping production brisk, dependable, and suitably prepared for the next item on the docket.",
    image: benefitImage(3, "Lightning fast delivery illustration"),
  },
  {
    id: "workspace",
    number: "Nº004",
    title: "Workspace",
    description:
      "Manage your design requests efficiently in our shared workspace, where active, queued, and completed tasks sit in plain view, with comments, files, and status notes kept in proper working order.",
    image: benefitImage(4, "Workspace illustration"),
  },
  {
    id: "flexible",
    number: "Nº005",
    title: "Flexible and scalable",
    description:
      "Scale up or down as the business requires, and pause or cancel whenever the programme changes, giving your operation the flexibility to expand, contract, or stand by without ceremony.",
    image: benefitImage(5, "Flexible and scalable illustration"),
  },
];

// Prices are numbers (USD); the UI formats them.
export const packages = [
  {
    id: "standard",
    kind: "membership",
    name: "Standard.PKG",
    badge: null,
    price: 3500,
    compareAtPrice: 4000,
    pricePrefix: null,
    period: "mo",
    summary: "One request at a time. First come first serve.",
    features: [
      "1 request at a time",
      "Average 72 hour delivery",
      "Unlimited Stock Photos/Video",
      "Unlimited revisions",
      "Unlimited brands",
      "Invite your whole team",
      "Pause or cancel anytime",
    ],
    cta: "Get started with Standard",
  },
  {
    id: "pro",
    kind: "membership",
    name: "Pro.PKG",
    badge: "Popular",
    price: 6500,
    compareAtPrice: null,
    pricePrefix: null,
    period: "mo",
    summary: "Double the requests. For brands ready to go zero to one & beyond.",
    features: [
      "2 requests at a time",
      "Average 72 hour delivery",
      "Framer/Webflow Development",
      "Unlimited Stock Photos/Video",
      "Unlimited revisions",
      "Invite your whole team",
      "Pause or cancel anytime",
    ],
    cta: "Get started with Pro",
  },
  {
    id: "brand-sprint",
    kind: "sprint",
    name: "Brand Sprint",
    badge: null,
    price: 12000,
    compareAtPrice: null,
    pricePrefix: "From",
    period: null,
    summary: "Double the requests. For brands ready to go zero to one & beyond.",
    features: [
      "Logo",
      "Logo Animation",
      "Color Palette",
      "Typography",
      "Supergraphics",
      "Brand Elements",
      "Business Cards & Collateral",
      "Merch/Shirts",
      "Landing Page Design",
      "Presentation Templates",
      "Brand Guidelines",
    ],
    cta: "Get started with Brand Sprint",
  },
];

export const sections = { works, benefits, packages };

export const SECTION_NAMES = Object.keys(sections);
