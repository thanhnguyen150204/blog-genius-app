import { Card, BlockStack, Text, InlineStack, Icon } from "@shopify/polaris";
import { ChevronRightIcon } from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

export function GeoTechnicalHealthCard({
  missingFaqCount = 1,
  missingSummaryCount = 1,
  onFixChecklist,
  onOpenFreshness,
}) {
  const shopify = useAppBridge();

  const handleKeyDown = (callback) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  const checklistItems = [
    {
      id: "crawlers",
      title: "AI crawlers are not blocked",
      subtitle: "robots.txt allows GPTBot, ClaudeBot, PerplexityBot",
      isSatisfied: true,
      action: () => shopify.toast?.show("AI crawlers are not blocked (robots.txt is configured)"),
    },
    {
      id: "faq",
      title: missingFaqCount > 0 ? `${missingFaqCount} posts missing FAQ schema` : "0 posts missing FAQ schema",
      subtitle: "Apply JSON-LD automatically to improve citation odds",
      isSatisfied: missingFaqCount === 0,
      action: () => onFixChecklist("faq"),
    },
    {
      id: "refresh",
      title: "0 posts overdue for refresh",
      subtitle: "Not updated in 90+ days — prioritize refreshing",
      isSatisfied: true,
      action: onOpenFreshness,
    },
    {
      id: "summary",
      title: missingSummaryCount > 0 ? `${missingSummaryCount} posts missing a summary block` : "0 posts missing a summary block",
      subtitle: "Add a concise summary block near the top for direct AI answers",
      isSatisfied: missingSummaryCount === 0,
      action: () => onFixChecklist("summary"),
    },
  ];

  return (
    <div className="geo-health-card-container">
      <Card>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <BlockStack gap="100">
            <Text variant="headingMd" as="h2">
              GEO technical health
            </Text>
            <Text variant="bodySm" tone="subdued">
              Factors affecting how likely AI engines are to cite you
            </Text>
          </BlockStack>

          <BlockStack gap="100">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                className="geo-checklist-item"
                onClick={item.action}
                onKeyDown={handleKeyDown(item.action)}
              >
                <InlineStack gap="300" blockAlign="center" wrap={false}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: item.isSatisfied ? "#d1fae5" : "#fef3c7",
                      color: item.isSatisfied ? "#059669" : "#d97706",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: item.isSatisfied ? "13px" : "14px",
                      fontWeight: "bold",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.isSatisfied ? "✓" : "!"}
                  </span>
                  <BlockStack gap="050">
                    <Text variant="bodySm" fontWeight="semibold">
                      {item.title}
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      {item.subtitle}
                    </Text>
                  </BlockStack>
                </InlineStack>
                <Icon source={ChevronRightIcon} tone="subdued" />
              </div>
            ))}
          </BlockStack>
        </div>
      </Card>
    </div>
  );
}

export default GeoTechnicalHealthCard;
