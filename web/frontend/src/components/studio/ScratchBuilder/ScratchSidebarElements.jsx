import { BlockStack, Text, Icon } from "@shopify/polaris";
import {
  TextWithImageIcon,
  MagicIcon,
  CollectionIcon,
  QuestionCircleIcon,
  InfoIcon,
  LayoutColumns2Icon,
  ImageIcon,
} from "@shopify/polaris-icons";

export function ScratchSidebarElements({ onInsertBlock }) {
  const elementCategories = [
    {
      title: "Content & Typography",
      items: [
        {
          type: "heading",
          label: "Heading (H2)",
          description: "Section header for content division",
          icon: TextWithImageIcon,
          payload: { type: "heading", level: "h2", text: "New Section Heading" },
        },
        {
          type: "paragraph",
          label: "Paragraph Text",
          description: "Rich informative paragraph",
          icon: TextWithImageIcon,
          payload: {
            type: "paragraph",
            text: "Add detailed analysis, customer insights, or actionable advice here.",
          },
        },
      ],
    },
    {
      title: "GEO & AI Search Blocks",
      items: [
        {
          type: "answer-block",
          label: "Direct Answer Summary",
          description: "40-80 word direct answer for Google AI Overviews",
          icon: MagicIcon,
          badge: "GEO",
          payload: {
            type: "answer-block",
            title: "Direct Answer Summary",
            text: "This summary provides concise, authoritative facts designed for citation by generative search engines like Perplexity, ChatGPT, and Google AI Overviews.",
          },
        },
        {
          type: "faq",
          label: "FAQ Schema Block",
          description: "Collapsible Q&A item with JSON-LD schema",
          icon: QuestionCircleIcon,
          badge: "Schema",
          payload: {
            type: "faq",
            question: "How does this benefit your Shopify store?",
            answer: "Structured FAQs improve click-through rate and enable AI search engines to pull exact answers for customers.",
          },
        },
      ],
    },
    {
      title: "Shopify Ecommerce & Media",
      items: [
        {
          type: "product",
          label: "Featured Product Card",
          description: "Interactive product card with price and Buy button",
          icon: CollectionIcon,
          payload: {
            type: "product",
            title: "Pro Snowboard Edition 2026",
            price: "$349.00",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
            description: "Handcrafted performance board designed for maximum responsiveness.",
          },
        },
        {
          type: "image",
          label: "Image with Caption",
          description: "Responsive banner with alt tag and caption",
          icon: ImageIcon,
          payload: {
            type: "image",
            url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
            caption: "Featured visual example",
            alt: "Visual illustration",
          },
        },
        {
          type: "callout",
          label: "Callout / Tip Box",
          description: "Highlighted box for key notices and recommendations",
          icon: InfoIcon,
          payload: {
            type: "callout",
            tone: "info",
            title: "Pro Merchant Tip",
            text: "Remember to update your inventory status regularly to ensure search crawlers display in-stock badges.",
          },
        },
        {
          type: "table",
          label: "Feature Comparison Grid",
          description: "Structured comparison table for buyers",
          icon: LayoutColumns2Icon,
          payload: {
            type: "table",
            headers: ["Feature", "Standard Tier", "Pro Edition"],
            rows: [
              ["Material", "Composite Wood", "Carbon Fiber Core"],
              ["Warranty", "1 Year", "Lifetime Coverage"],
              ["GEO Score", "72 / 100", "98 / 100"],
            ],
          },
        },
      ],
    },
  ];

  return (
    <div
      style={{
        width: "350px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        overflowY: "auto",
        height: "calc(100vh - 56px)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flexShrink: 0,
      }}
    >
      <Text variant="headingSm" as="h3" fontWeight="bold">
        Add Elements &amp; Sections
      </Text>

      {elementCategories.map((cat, catIdx) => (
        <BlockStack key={catIdx} gap="150">
          <Text variant="bodyXs" fontWeight="bold" tone="subdued">
            {cat.title.toUpperCase()}
          </Text>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {cat.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                onClick={() => onInsertBlock(item.payload)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e4e4e7",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  transition: "border-color 0.15s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#ea580c";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e4e4e7";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    backgroundColor: "#f4f4f5",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon source={item.icon} tone="base" />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text variant="bodySm" fontWeight="semibold">
                      {item.label}
                    </Text>
                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <Text variant="bodyXs" tone="subdued">
                    {item.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </BlockStack>
      ))}
    </div>
  );
}

export default ScratchSidebarElements;
