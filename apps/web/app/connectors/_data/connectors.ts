export type ConnectorMeta = {
  slug: string; // URL segment for existing connector route
  title: string; // Human readable connector name
  summary: string; // Short description for hub card
  route: string; // Path to existing connector page
  tags: string[]; // Tags used for filtering in the hub
  sample?: string; // Example query to display
  tips: string[]; // Usage tips displayed in expandable section
  icon?: string; // Optional public path to icon
};

// Local registry keeps hub self-contained and avoids touching global configs.
export const CONNECTORS: ConnectorMeta[] = [
  {
    slug: "off",
    title: "Open Food Facts",
    summary: "Search food products; view Nutri-Score, Eco-Score, NOVA & labels.",
    route: "/connectors/off",
    tags: ["products","food","labels"],
    sample: "Try: oat milk, dark chocolate",
    tips: [
      "Type a product name; results show Nutri/Eco scores when available.",
      "Use precise terms (e.g., “organic oat milk 1L”) for better matches."
    ],
    icon: "/connectors/icons/food.svg"
  },
  {
    slug: "ifixit",
    title: "iFixit",
    summary: "Repair guides & parts references for devices and appliances.",
    route: "/connectors/ifixit",
    tags: ["repair","guides","devices"],
    sample: "Try: iPhone 12 screen, Dyson v8 battery",
    tips: [
      "Search by model name; open a guide to see tools & steps.",
      "Prefer exact model codes for precise results."
    ],
    icon: "/connectors/icons/repair.svg"
  },
  {
    slug: "ebay",
    title: "eBay (Refurb / Used)",
    summary: "Discover second-hand & refurb listings to extend product lifecycles.",
    route: "/connectors/ebay",
    tags: ["resale","marketplace"],
    sample: "Try: ThinkPad T14, ‘monitor 27\" refurb’",
    tips: [
      "Use specific models plus “refurbished” or “used” in your query.",
      "Filter inside the page for price and condition if provided."
    ],
    icon: "/connectors/icons/market.svg"
  },
  {
    slug: "energystar",
    title: "ENERGY STAR",
    summary: "Find energy-efficient appliances and electronics.",
    route: "/connectors/energystar",
    tags: ["efficiency","appliances"],
    sample: "Try: refrigerators, heat pumps",
    tips: [
      "Start with a category (e.g., refrigerators).",
      "Use page filters like capacity or form factor if available."
    ],
    icon: "/connectors/icons/energy.svg"
  },
  {
    slug: "tco",
    title: "TCO Certified",
    summary: "IT products meeting sustainability criteria (social & environmental).",
    route: "/connectors/tco",
    tags: ["certification","it"],
    sample: "Try: monitors 27\", laptops",
    tips: [
      "Begin with a product category (e.g., displays).",
      "Look for model-specific certificates."
    ],
    icon: "/connectors/icons/cert.svg"
  },
  {
    slug: "eu-ecolabel",
    title: "EU Ecolabel (Products)",
    summary: "Products meeting EU Ecolabel criteria across many categories.",
    route: "/connectors/eu-ecolabel",
    tags: ["certification","consumer"],
    sample: "Try: detergents, tissue paper",
    tips: [
      "Search by category or brand.",
      "Use generic terms first, then narrow."
    ],
    icon: "/connectors/icons/leaf.svg"
  },
  {
    slug: "green-seal",
    title: "Green Seal",
    summary: "Green Seal certified products (cleaners, paper, more).",
    route: "/connectors/green-seal",
    tags: ["certification","cleaning"],
    sample: "Try: all-purpose cleaner",
    tips: [
      "Start with a product type (e.g., ‘glass cleaner’).",
      "Brand names can help refine."
    ],
    icon: "/connectors/icons/leaf.svg"
  },
  {
    slug: "fairtrade",
    title: "Fairtrade Product Finder",
    summary: "Spot products carrying the Fairtrade Mark.",
    route: "/connectors/fairtrade",
    tags: ["ethical","food","beverage"],
    sample: "Try: chocolate, coffee beans",
    tips: [
      "Search by product type; country/brand filters if available.",
      "Short queries work well (e.g., ‘coffee’)."
    ],
    icon: "/connectors/icons/fair.svg"
  },
  {
    slug: "lot-uk",
    title: "Library of Things (UK)",
    summary: "Borrow items locally instead of buying.",
    route: "/connectors/lot-uk",
    tags: ["borrow","local","uk"],
    sample: "Try: postcode + item (e.g., NW1 8AH drill)",
    tips: [
      "Enter your UK postcode and the thing you need.",
      "Check item availability and pickup location."
    ],
    icon: "/connectors/icons/borrow.svg"
  },
  {
    slug: "cdp",
    title: "CDP (Carbon Disclosure Project)",
    summary: "Company climate disclosures and scores.",
    route: "/connectors/cdp",
    tags: ["companies","climate","esg"],
    sample: "Try: Unilever, Tesco",
    tips: [
      "Search by company name.",
      "Use full legal names for best results."
    ],
    icon: "/connectors/icons/company.svg"
  }
];
