import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Icon,
} from "@shopify/polaris";
import { ChevronRightIcon } from "@shopify/polaris-icons";

export function GeoTechnicalHealthCard({
  geoFactors = {
    crawlers: true,
    freshness: true,
    tables: true,
    statistics: true,
    faq: false,
    summary: false,
    author: false,
  },
  onFixChecklist,
  onOpenFreshness,
  cardHeight,
}) {
  const handleKeyDown = (callback) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  const checklistItems = [
    {
      id: "crawlers",
      title: geoFactors.crawlers
        ? "AI crawlers are not blocked"
        : "AI crawlers blocked in robots.txt",
      subtitle: "robots.txt allows GPTBot, ClaudeBot, PerplexityBot",
      isSatisfied: geoFactors.crawlers,
      action: () => onFixChecklist("crawlers"),
    },
    {
      id: "faq",
      title: geoFactors.faq
        ? "FAQ Schema (JSON-LD) active"
        : "1 posts missing FAQ schema",
      subtitle: geoFactors.faq
        ? "schema.org/FAQPage structures Q&A for direct AI extraction"
        : "Apply JSON-LD automatically to improve citation odds",
      isSatisfied: geoFactors.faq,
      action: () => onFixChecklist("faq"),
    },
    {
      id: "freshness",
      title: geoFactors.freshness
        ? "0 posts overdue for refresh"
        : "1 posts overdue for refresh",
      subtitle: "Not updated in 90+ days — prioritize refreshing",
      isSatisfied: geoFactors.freshness,
      action: onOpenFreshness,
    },
    {
      id: "summary",
      title: geoFactors.summary
        ? "Direct Answer block verified"
        : "1 posts missing a summary block",
      subtitle: "Add a concise summary block near the top for direct AI answers",
      isSatisfied: geoFactors.summary,
      action: () => onFixChecklist("summary"),
    },
    {
      id: "author",
      title: geoFactors.author
        ? "Author E-E-A-T credentials verified"
        : "1 posts missing Author credentials",
      subtitle: "Add author bio & Person schema to establish AI source trust",
      isSatisfied: geoFactors.author,
      action: () => onFixChecklist("author"),
    },
    {
      id: "statistics",
      title: geoFactors.statistics
        ? "Statistics & citations verified"
        : "1 posts missing quantitative facts",
      subtitle: "Adding statistics boosts AI citation probability by up to 41%",
      isSatisfied: geoFactors.statistics,
      action: () => onFixChecklist("statistics"),
    },
    {
      id: "tables",
      title: geoFactors.tables
        ? "Comparison tables structured"
        : "1 posts missing structured tables",
      subtitle: "HTML table formatting increases AI extraction accuracy by 38%",
      isSatisfied: geoFactors.tables,
      action: () => onFixChecklist("tables"),
    },
  ];

  return (
    <div
      className="geo-technical-health-card"
      style={cardHeight ? { height: `${cardHeight}px`, minHeight: `${cardHeight}px` } : undefined}
    >
      <Card>
        <div className="geo-card-content">
          <BlockStack gap="050">
            <Text variant="headingMd" as="h2">
              GEO technical health
            </Text>
            <Text variant="bodySm" tone="subdued">
              Factors affecting how likely AI engines are to cite you
            </Text>
          </BlockStack>

          <div className="geo-checklist-items-wrap">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                className="geo-checklist-item"
                onClick={item.action}
                onKeyDown={handleKeyDown(item.action)}
              >
                <InlineStack align="space-between" blockAlign="center" wrap={false} gap="200">
                  <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: item.isSatisfied ? "#d1fae5" : "#fef3c7",
                        color: item.isSatisfied ? "#059669" : "#d97706",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: item.isSatisfied ? "12px" : "13px",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {item.isSatisfied ? "✓" : "!"}
                    </span>
                    <BlockStack gap="025">
                      <Text variant="bodySm" fontWeight="semibold">
                        {item.title}
                      </Text>
                      <Text variant="bodyXs" tone="subdued">
                        {item.subtitle}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <div style={{ flexShrink: 0, marginLeft: "8px" }}>
                    <Icon source={ChevronRightIcon} tone="subdued" />
                  </div>
                </InlineStack>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default GeoTechnicalHealthCard;
