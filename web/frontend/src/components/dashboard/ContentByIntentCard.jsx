import { Card, BlockStack, Text, ProgressBar, InlineStack } from "@shopify/polaris";

export function ContentByIntentCard({
  totalPosts = 1,
  informationalCount = 1,
  buyersGuideCount = 0,
  faqCount = 0,
  howToCount = 0,
  companyFactsCount = 0,
  aboutCount = 0,
}) {
  return (
    <div className="dashboard-card-stretch">
      <Card>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
          <BlockStack gap="100">
            <Text variant="headingMd" as="h2">
              Content by intent
            </Text>
            <Text variant="bodySm" tone="subdued">
              Distribution of {totalPosts} existing posts by GEO goal
            </Text>
          </BlockStack>

          <ProgressBar progress={100} size="small" tone="highlight" />

          <InlineStack gap="400" wrap>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2563eb" }} />
              <Text variant="bodySm">Informational • {informationalCount}</Text>
            </InlineStack>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ea580c" }} />
              <Text variant="bodySm">Buyer&apos;s guide • {buyersGuideCount}</Text>
            </InlineStack>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#059669" }} />
              <Text variant="bodySm">FAQ • {faqCount}</Text>
            </InlineStack>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0284c7" }} />
              <Text variant="bodySm">How-to • {howToCount}</Text>
            </InlineStack>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#dc2626" }} />
              <Text variant="bodySm">Company Facts • {companyFactsCount}</Text>
            </InlineStack>
            <InlineStack gap="150" blockAlign="center">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#7c3aed" }} />
              <Text variant="bodySm">About • {aboutCount}</Text>
            </InlineStack>
          </InlineStack>
        </div>
      </Card>
    </div>
  );
}

export default ContentByIntentCard;
