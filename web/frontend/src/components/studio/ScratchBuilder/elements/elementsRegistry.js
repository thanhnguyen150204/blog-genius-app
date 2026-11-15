import {
  TextTitleIcon,
  TextAlignLeftIcon,
  TextQuoteIcon,
  DataTableIcon,
  ListBulletedIcon,
  TextWithImageIcon,
  ImageIcon,
  PlayCircleIcon,
  ImagesIcon,
  ClipboardChecklistIcon,
  ProductIcon,
  CollectionIcon,
  LayoutColumns3Icon,
  ButtonIcon,
  CodeIcon,
  IdentityCardIcon,
  StarIcon,
  StoreIcon,
  ListNumberedIcon,
  CalendarTimeIcon,
  EmailIcon,
  ShareIcon,
} from "@shopify/polaris-icons";

// Categories metadata for builder sidebar
export const ELEMENT_CATEGORIES = [
  { id: "text", title: "Text" },
  { id: "media", title: "Media" },
  { id: "product", title: "Product" },
  { id: "other", title: "Other" },
  { id: "company_facts", title: "Company & Facts" },
];

// Tool registry mapping every element to its schema, icon, and default payload
export const ELEMENT_TOOLS = [
  // --- 1. Text Group ---
  {
    id: "tool-heading",
    type: "heading",
    category: "text",
    label: "Heading",
    icon: TextTitleIcon,
    description: "Section header for content structure",
    toolConfig: {
      inspectorTool: "typography",
      supportedLevels: ["h1", "h2", "h3", "h4"],
    },
    defaultPayload: {
      type: "heading",
      level: "h2",
      text: "Explore Mountain Adventure Equipment",
    },
  },
  {
    id: "tool-paragraph",
    type: "paragraph",
    category: "text",
    label: "Paragraph",
    icon: TextAlignLeftIcon,
    description: "Rich informative paragraph text",
    toolConfig: {
      inspectorTool: "typography",
      supportsFormatting: true,
    },
    defaultPayload: {
      type: "paragraph",
      text: "Choosing the right gear requires understanding terrain difficulties, weather resistance, and your personal riding preferences. Here are key insights to help you decide.",
    },
  },
  {
    id: "tool-quote",
    type: "quote",
    category: "text",
    label: "Quote",
    icon: TextQuoteIcon,
    description: "Highlighted testimonial or expert quotation",
    toolConfig: {
      inspectorTool: "quote-editor",
      fields: ["quote", "author", "role"],
    },
    defaultPayload: {
      type: "quote",
      text: "The right board does not just enhance performance; it transforms your entire mountain experience.",
      author: "Alex Morgan",
      role: "Lead Gear Specialist",
    },
  },
  {
    id: "tool-table",
    type: "table",
    category: "text",
    label: "Table",
    icon: DataTableIcon,
    description: "Comparison grid or structured data table",
    toolConfig: {
      inspectorTool: "table-editor",
      supportsDynamicRows: true,
    },
    defaultPayload: {
      type: "table",
      headers: ["Specification", "Standard Model", "Pro All-Mountain"],
      rows: [
        ["Flex Rating", "Medium (5/10)", "Stiff (8/10)"],
        ["Rocker Profile", "Camber / Rocker", "True Camber"],
        ["Recommended Weight", "65 - 80 kg", "75 - 95 kg"],
      ],
    },
  },
  {
    id: "tool-list",
    type: "list",
    category: "text",
    label: "List",
    icon: ListBulletedIcon,
    description: "Bulleted or numbered points",
    toolConfig: {
      inspectorTool: "list-editor",
      listTypes: ["bulleted", "numbered"],
    },
    defaultPayload: {
      type: "list",
      style: "bulleted",
      items: [
        "Lightweight paulownia wood core for snappy flex",
        "Sintered base for exceptional glide and wax retention",
        "Tri-axial fiberglass reinforcement for torsional stability",
      ],
    },
  },
  {
    id: "tool-image-text",
    type: "image-text",
    category: "text",
    label: "Image & Text",
    icon: TextWithImageIcon,
    description: "Side-by-side visual and descriptive column",
    toolConfig: {
      inspectorTool: "layout-editor",
      imagePositions: ["left", "right"],
    },
    defaultPayload: {
      type: "image-text",
      layout: "image-left",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      imageAlt: "Alpine terrain exploration",
      title: "Precision Engineering",
      text: "Every contour is crafted to deliver maximum edge hold on icy descents while maintaining playful float in deep powder.",
    },
  },

  // --- 2. Media Group ---
  {
    id: "tool-image",
    type: "image",
    category: "media",
    label: "Image",
    icon: ImageIcon,
    description: "Responsive visual image banner",
    toolConfig: {
      inspectorTool: "media-library",
      supportsAlt: true,
      supportsCaption: true,
    },
    defaultPayload: {
      type: "image",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80",
      alt: "Panoramic alpine peak view",
      caption: "Panoramic mountain ranges tested during field evaluations.",
    },
  },
  {
    id: "tool-video",
    type: "video",
    category: "media",
    label: "Video",
    icon: PlayCircleIcon,
    description: "Embedded video player with play controls",
    toolConfig: {
      inspectorTool: "video-editor",
      sources: ["youtube", "vimeo", "shopify-file"],
    },
    defaultPayload: {
      type: "video",
      title: "All-Mountain Riding Techniques & Setup Walkthrough",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      duration: "04:25",
    },
  },
  {
    id: "tool-gallery",
    type: "image-gallery",
    category: "media",
    label: "Image Gallery",
    icon: ImagesIcon,
    description: "Multi-image responsive photo grid",
    toolConfig: {
      inspectorTool: "gallery-editor",
      columns: [2, 3, 4],
    },
    defaultPayload: {
      type: "image-gallery",
      columns: 3,
      images: [
        {
          url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop&q=80",
          alt: "Action turn on powder",
        },
        {
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80",
          alt: "Mountain sunrise overview",
        },
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
          alt: "Gear inspection workshop",
        },
      ],
    },
  },
  {
    id: "tool-faq",
    type: "faq-accordion",
    category: "media",
    label: "Faq Accordion",
    icon: ClipboardChecklistIcon,
    description: "Expandable FAQ list with structured data schema",
    toolConfig: {
      inspectorTool: "faq-schema-editor",
      geoOptimized: true,
    },
    defaultPayload: {
      type: "faq-accordion",
      items: [
        {
          question: "What length should I choose for an all-mountain board?",
          answer: "As a general guideline, stand the board upright; the tip should reach between your chin and nose, adjusted for rider weight and stiffness preference.",
        },
        {
          question: "Can beginners use an all-mountain setup?",
          answer: "Yes, all-mountain boards with medium flex provide stability for learning while offering ample room to progress across varied conditions.",
        },
      ],
    },
  },

  // --- 3. Product Group ---
  {
    id: "tool-product-card",
    type: "product-card",
    category: "product",
    label: "Product card",
    icon: ProductIcon,
    description: "Shoppable Shopify product spotlight card",
    toolConfig: {
      inspectorTool: "shopify-resource-picker",
      resourceType: "product",
    },
    defaultPayload: {
      type: "product-card",
      title: "Alpine Explorer Pro Edition",
      subtitle: "High-performance all-mountain board",
      price: "$499.00",
      compareAtPrice: "$599.00",
      rating: 4.9,
      reviewCount: 38,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
      productHandle: "alpine-explorer-pro",
      badge: "Best Seller",
    },
  },
  {
    id: "tool-collection-card",
    type: "collection-card",
    category: "product",
    label: "Collection card",
    icon: CollectionIcon,
    description: "Shopify category and collection banner",
    toolConfig: {
      inspectorTool: "shopify-resource-picker",
      resourceType: "collection",
    },
    defaultPayload: {
      type: "collection-card",
      title: "All-Mountain Snowboards Collection",
      itemCount: 24,
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
      ctaText: "Shop Collection",
      collectionHandle: "snowboards",
    },
  },
  {
    id: "tool-product-grid",
    type: "product-grid",
    category: "product",
    label: "Product grid",
    icon: LayoutColumns3Icon,
    description: "Multi-item shoppable showcase grid",
    toolConfig: {
      inspectorTool: "shopify-resource-picker",
      resourceType: "products",
      limit: 3,
    },
    defaultPayload: {
      type: "product-grid",
      columns: 3,
      products: [
        {
          title: "Peak Cruiser X",
          price: "$379.00",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
          tag: "Freeride",
        },
        {
          title: "Steep Carver 2.0",
          price: "$429.00",
          imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop&q=80",
          tag: "Carving",
        },
        {
          title: "Summit Nomad",
          price: "$519.00",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
          tag: "Powder",
        },
      ],
    },
  },

  // --- 4. Other Group ---
  {
    id: "tool-button",
    type: "button",
    category: "other",
    label: "Button",
    icon: ButtonIcon,
    description: "High-conversion Call-To-Action button",
    toolConfig: {
      inspectorTool: "button-style-editor",
      fields: ["text", "url", "variant", "size"],
    },
    defaultPayload: {
      type: "button",
      text: "Shop All-Mountain Gear Now",
      url: "/collections/all-mountain",
      variant: "primary",
      align: "center",
    },
  },
  {
    id: "tool-custom-html",
    type: "custom-html",
    category: "other",
    label: "Custom HTML",
    icon: CodeIcon,
    description: "Raw HTML snippet or custom widget embed",
    toolConfig: {
      inspectorTool: "code-editor",
      sanitized: true,
    },
    defaultPayload: {
      type: "custom-html",
      code: '<div style="padding:16px;background:#f8fafc;border:1px dashed #94a3b8;border-radius:8px;text-align:center;">\n  <p style="margin:0;font-size:14px;color:#334155;"><strong>Custom Embed Widget:</strong> Insert custom scripts, calculators, or iframes here.</p>\n</div>',
    },
  },

  // --- 5. Company & Facts Group ---
  {
    id: "tool-company-hero",
    type: "company-hero",
    category: "company_facts",
    label: "Company Profile Hero",
    icon: IdentityCardIcon,
    description: "Brand identity card with mission and stats",
    toolConfig: {
      inspectorTool: "company-facts-editor",
    },
    defaultPayload: {
      type: "company-hero",
      companyName: "Summit Dynamics Labs",
      badgeText: "Official Partner",
      tagline: "Pioneering sustainable outdoor technologies since 2018.",
      foundedYear: "2018",
      headquarters: "Innsbruck, Austria",
    },
  },
  {
    id: "tool-fact-highlight",
    type: "fact-highlight",
    category: "company_facts",
    label: "Fact Highlight Card",
    icon: StarIcon,
    description: "Featured proof point or authoritative highlight",
    toolConfig: {
      inspectorTool: "fact-editor",
    },
    defaultPayload: {
      type: "fact-highlight",
      headline: "100% Recycled Carbon Fibers",
      detail: "Every deck produced reduces carbon emissions by 42% compared to conventional manufacturing processes.",
      source: "Alpine Environmental Audit 2025",
    },
  },
  {
    id: "tool-offering-card",
    type: "offering-card",
    category: "company_facts",
    label: "Offering Card",
    icon: StoreIcon,
    description: "Value proposition and warranty guarantee badge",
    toolConfig: {
      inspectorTool: "offering-editor",
    },
    defaultPayload: {
      type: "offering-card",
      title: "Lifetime Deck Guarantee",
      description: "Comprehensive structural warranty covering core fractures and edge delamination under regular riding conditions.",
      cta: "Read Warranty Terms",
    },
  },
  {
    id: "tool-key-metrics",
    type: "key-metrics",
    category: "company_facts",
    label: "Key Metrics List",
    icon: ListNumberedIcon,
    description: "Quantitative numbers and statistical data",
    toolConfig: {
      inspectorTool: "metrics-editor",
      columns: 3,
    },
    defaultPayload: {
      type: "key-metrics",
      metrics: [
        { value: "48,000+", label: "Riders Equipped" },
        { value: "99.4%", label: "Satisfaction Rate" },
        { value: "12", label: "Global Design Awards" },
      ],
    },
  },
  {
    id: "tool-milestone-timeline",
    type: "milestone-timeline",
    category: "company_facts",
    label: "Milestone Timeline",
    icon: CalendarTimeIcon,
    description: "Chronological history milestones",
    toolConfig: {
      inspectorTool: "timeline-editor",
    },
    defaultPayload: {
      type: "milestone-timeline",
      milestones: [
        { year: "2020", title: "First Eco-Flex Core Patent" },
        { year: "2023", title: "Global Expansion to 35 Countries" },
        { year: "2026", title: "Launch of AI-Driven All-Mountain Line" },
      ],
    },
  },
  {
    id: "tool-contact-grid",
    type: "contact-grid",
    category: "company_facts",
    label: "Contact Grid",
    icon: EmailIcon,
    description: "Quick contact and merchant support channels",
    toolConfig: {
      inspectorTool: "contact-editor",
    },
    defaultPayload: {
      type: "contact-grid",
      email: "support@summitdynamics.com",
      phone: "+1 (800) 555-RIDE",
      hours: "Mon - Fri, 9:00 AM - 6:00 PM EST",
    },
  },
  {
    id: "tool-social-strip",
    type: "social-strip",
    category: "company_facts",
    label: "Social Channels Strip",
    icon: ShareIcon,
    description: "Direct social channels and community follow bar",
    toolConfig: {
      inspectorTool: "social-editor",
    },
    defaultPayload: {
      type: "social-strip",
      channels: [
        { name: "Instagram", url: "https://instagram.com" },
        { name: "YouTube", url: "https://youtube.com" },
        { name: "Twitter", url: "https://twitter.com" },
      ],
    },
  },
];
